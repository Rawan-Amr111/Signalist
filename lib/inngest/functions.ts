import { getAllUsersForNewsEmail } from "./../actions/user.actions";
import { inngest } from "./client";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompts";

import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { getNews } from "../actions/finnhub.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { formatDateToday } from "../utils";

export interface UserForNewsEmail {
  id: string;
  email: string;
  name: string;
}

export const sendSignUpEmail = inngest.createFunction(
  {
    id: "user-created-flow",
    name: "User Created Flow",
    triggers: [{ event: "app/user.created" }],
  },
  async ({ event, step }) => {
    const data = event.data as {
      country: string;
      investmentGoals: string;
      riskTolerance: string;
      preferredIndustry: string;
      email: string;
      name: string;
    };

    const userProfile = `
    -Country: ${data.country}
    -Investment Goals: ${data.investmentGoals}
    -Risk Tolerance: ${data.riskTolerance}
    -Preferred Industry: ${data.preferredIndustry}`;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile,
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({
        model: "gemini-2.5-flash-lite",
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-welcome-email", async () => {
      let introText =
        "Thanks for joining Signalist! As someone focused on technology growth stocks, you'll love our real-time alerts for companies like the ones you're tracking. We'll help you spot opportunities before they become mainstream news.";

      if (response && typeof response === "object") {
        const candidates = (
          response as {
            candidates?: Array<{ content?: { parts?: Array<unknown> } }>;
          }
        ).candidates;
        const part = candidates?.[0]?.content?.parts?.[0];
        if (part && typeof part === "object" && "text" in part) {
          introText = (part as { text: string }).text;
        }
      }

      return await sendWelcomeEmail({
        email: data.email,
        name: data.name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  },
);
export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: "send-daily-news-summary",
    name: "Send Daily News Summary",
    triggers: [{ event: "app/send.daily.news" }, { cron: "9 12 * * *" }],
  },
  async ({ step }) => {
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);
    if (!users || users.length === 0)
      return { success: false, message: "No users found" };
    const results = await step.run("prepare-news-per-user", async () => {
      const perUser: Array<{
        user: UserForNewsEmail;
        articles: MarketNewsArticle[];
      }> = [];
      for (const user of users as UserForNewsEmail[]) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          articles = (articles || []).slice(0, 6);
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (e) {
          console.log(e);
        }
      }
      return perUser;
    });
    const userNewsSummaries: {
      user: UserForNewsEmail;
      newsContent: string | null;
    }[] = [];
    for (const { user, articles } of results) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          JSON.stringify(articles, null, 2),
        );
        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
          body: {
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          },
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent =
          (part && "text" in part ? part.text : null) || "No market news";
        userNewsSummaries.push({ user, newsContent });
      } catch (e) {
        console.log(e);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }
    await step.run("send-news-emails", async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;
          return await sendNewsSummaryEmail({
            email: user.email,
            date: formatDateToday,
            newsContent,
          });
        }),
      );
    });
    return {
      success: true,
      message: "Email sent successfully",
    };
  },
);
