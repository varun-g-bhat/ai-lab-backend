import express from "express";
import { compileCode, generate_hints } from "./codeCompilerConrtoller";

const compileRouter = express.Router();

compileRouter.post("/compile", compileCode);
compileRouter.post("/hints", generate_hints);
export default compileRouter;
