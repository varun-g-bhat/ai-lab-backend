// import express, { NextFunction, Request, Response } from "express";

// const compileCode = async (req: Request, res: Response, next: NextFunction) => {
//   let code = req.body.code;
//   let language = req.body.language;
//   let input = req.body.input;

//   let languageMap = {
//     c: { language: "c", version: "10.2.0" },
//     cpp: { language: "c++", version: "10.2.0" },
//     python: { language: "python", version: "3.10.0" },
//     java: { language: "java", version: "15.0.2" },
//   };

//   if (!languageMap[language]) {
//     return res.status(400).send({ error: "Unsupported language" });
//   }

//   let data = {
//     language: languageMap[language].language,
//     version: languageMap[language].version,
//     files: [
//       {
//         name: "main",
//         content: code,
//       },
//     ],
//     stdin: input,
//   };

//   let config = {
//     method: "post",
//     url: "https://emkc.org/api/v2/piston/execute",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: data,
//   };

//   // calling the code compilation API
//   Axios(config)
//     .then((response) => {
//       res.json(response.data.run); // Send the run object directly
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).send({ error: "Something went wrong" });
//     });
// };

import { Request, Response, NextFunction } from "express";
import axios, { AxiosRequestConfig } from "axios";
import { AuthRequest } from "../types/auth";
import createHttpError from "http-errors";

interface CompileCodeRequest {
  code: string;
  language: keyof typeof languageMap;
  input?: string;
}

const languageMap = {
  c: { language: "c", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
} as const;

const compileCode = async (
  req: Request<{}, {}, CompileCodeRequest>,
  res: Response,
  next: NextFunction
) => {
  const { code, language, input } = req.body;

  if (!languageMap[language]) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  const { language: lang, version } = languageMap[language];
  const payload = {
    language: lang,
    version,
    files: [{ name: "main", content: code }],
    stdin: input || "",
  };

  const apiUrl =
    process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute";
  const axiosConfig: AxiosRequestConfig = {
    method: "post",
    url: apiUrl,
    headers: { "Content-Type": "application/json" },
    data: payload,
    timeout: Number(process.env.API_TIMEOUT_MS) || 10000,
  };

  try {
    const response = await axios(axiosConfig);
    const runResult = response.data.run;
    return res.status(200).json(runResult);
  } catch (err: any) {
    console.error("Compilation API error:", err.message || err);
    return res.status(502).json({ error: "Failed to compile code" });
  }
};

const generate_hints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _req = req as AuthRequest;
    const { question, code } = req.body;
    const hints = await axios.post(
      `${process.env.PYTHON_BACKEND_URL}/aitutor/generate/hints`,
      {},
      {
        params: {
          question,
          code,
        },
      }
    );

    res.json(hints.data);
  } catch (error) {
    console.error("Error generating hints:", error);
    return next(createHttpError(500, "Error while generating hints"));
  }
};

export { compileCode, generate_hints };
