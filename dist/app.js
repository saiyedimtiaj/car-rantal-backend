"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandeller_1 = __importDefault(require("./app/middleware/globalErrorHandeller"));
const noRouteFound_1 = __importDefault(require("./app/middleware/noRouteFound"));
const app = (0, express_1.default)();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
}));
app.use((0, cookie_parser_1.default)());
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("<h1>Hello World by Saiyed Imtiaj</h1>");
});
app.use(globalErrorHandeller_1.default);
app.use(noRouteFound_1.default);
exports.default = app;
