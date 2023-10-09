import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from 'openai';

type RatingsSummary = {
    [metricName: string]: {
        levels: string[],
        totalEmoRatings: number,
        emoScoreDict: {
            [emoScore: string]: number
        },
        totalLevelRatings: number,
        levelScoreDict: {
            [levelScore: string]: number
        }
    }
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// const dummy = {
//     taskName: "User first time adding needs to sign a privacy policy",
//     ratings: [
//         {
//             emoScore: 0,
//             level: 1,
//             metric: {
//                 levels: [
//                     {
//                         levelLabel: "low",
//                         levelOrder: 1
//                     },
//                     {
//                         levelLabel: "medium",
//                         levelOrder: 2
//                     },
//                     {
//                         levelLabel: "high",
//                         levelOrder: 3
//                     }
//                 ],
//                 name: "Complexity"
//             }
//         },
//         {
//             emoScore: 4,
//             level: 3,
//             metric: {
//                 levels: [
//                     {
//                         levelLabel: "low",
//                         levelOrder: 1
//                     },
//                     {
//                         levelLabel: "medium",
//                         levelOrder: 2
//                     },
//                     {
//                         levelLabel: "high",
//                         levelOrder: 3
//                     }
//                 ],
//                 name: "Complexity"
//             }
//         },
//         {
//             emoScore: 4,
//             level: 1,
//             metric: {
//                 levels: [
//                     {
//                         levelLabel: "easy",
//                         levelOrder: 1
//                     },
//                     {
//                         levelLabel: "medium",
//                         levelOrder: 2
//                     },
//                     {
//                         levelLabel: "difficulty",
//                         levelOrder: 3
//                     }
//                 ],
//                 name: "Difficulty"
//             }
//         },
//         {
//             emoScore: 5,
//             level: 1,
//             metric: {
//                 levels: [
//                     {
//                         levelLabel: "easy",
//                         levelOrder: 1
//                     },
//                     {
//                         levelLabel: "medium",
//                         levelOrder: 2
//                     },
//                     {
//                         levelLabel: "difficulty",
//                         levelOrder: 3
//                     }
//                 ],
//                 name: "Difficulty"
//             }
//         }
//     ]
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { data } = req.body
        try {
            var prompt = generatePrompt(data)
            console.log(prompt)
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content:  prompt}],
                model: "gpt-3.5-turbo"
            });
            console.log(new Date())
            res.status(200).json({result: completion.choices[0].message.content})
        } catch (error: any) {
            if (error.response) {
                console.error(error.response.status, error.response.data);
                res.status(error.response.status).json(error.response.data);
            } else {
                console.error(`Error with OpenAI API request: ${error.message}`);
                res.status(500).json({
                    error: {
                        message: 'An error occurred during your request.',
                    }
                });
            }
        }
    }
}
    
function generatePrompt(data: any): string {
    var taskName = data.taskName
    var processedData: RatingsSummary = generateRatingsSummary(data)
    var statsString = ""
    for (let metric in processedData) {
        let levelStatsString = ''
        let stats = processedData[metric]
        for (let levelString in stats.levelScoreDict) {
            var level = levelString as unknown as number
            var levelLabel = stats.levels[level-1]
            var levelPercentage = Math.round(stats.levelScoreDict[levelString] / stats.totalLevelRatings * 100)
            levelStatsString = levelStatsString == '' ? levelStatsString : levelStatsString + ', '
            levelStatsString += `${levelPercentage}% ${levelLabel}`
        }

        let emoStatsString = ""
        for (let emoScore in stats.emoScoreDict) {
            emoStatsString = emoStatsString == '' ? emoStatsString : emoStatsString + ', '
            var emoScorePercentage = Math.round(stats.emoScoreDict[emoScore] / stats.totalEmoRatings * 100)
            emoStatsString += `${emoScorePercentage}% ${emoScore}`
        }
        statsString += `${metric} ratings: ${levelStatsString}. Emotions on ${metric}: ${emoStatsString}.\n`
    }
    return `I am a team manager.  A user story of the project is: ${taskName}. Team members rated the story based on different metrics, and their emotion on the scale of 1 to 5, with 5 being very happy. The ratings are:
    ${statsString}Please provide tailored advice to manage the team working on this card in the next 2 weeks`;
}

function generateRatingsSummary(data: any): RatingsSummary {
    var processedData: any = {}
    data.ratings.forEach((rating: any) => {
        if (!(rating.metric.name in processedData)) {
            processedData[rating.metric.name] = {
                levels: rating.metric.levels.map((level: any) => level.levelLabel), // TODO: sort the array before assigning
                totalEmoRatings: 0,
                emoScoreDict: {},
                totalLevelRatings: 0,
                levelScoreDict: {}
            }
        }
        if (rating.emoScore && rating.emoScore != 0) {
            if (!(rating.emoScore.toString() in processedData[rating.metric.name].emoScoreDict)) {
                processedData[rating.metric.name].emoScoreDict[rating.emoScore.toString()] = 0
            }
            processedData[rating.metric.name].emoScoreDict[rating.emoScore.toString()]++
            processedData[rating.metric.name].totalEmoRatings++
        }
        if (rating.level && rating.level != 0) {
            if (!(rating.level.toString() in processedData[rating.metric.name].levelScoreDict)) {
                processedData[rating.metric.name].levelScoreDict[rating.level.toString()] = 0
            }
            processedData[rating.metric.name].levelScoreDict[rating.level.toString()]++
            processedData[rating.metric.name].totalLevelRatings++
        }
    });
    return processedData
}