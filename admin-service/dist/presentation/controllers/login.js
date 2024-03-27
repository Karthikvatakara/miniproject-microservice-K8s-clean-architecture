"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginController = (dependencies) => {
    console.log(dependencies, "-------------");
    const { usecases: { loginAdminUseCase } } = dependencies;
    const loginAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const adminCredentials = req.body;
            const admin = yield loginAdminUseCase(dependencies).execute(adminCredentials);
            console.log("🚀 ~ file: login.ts:15 ~ loginAdmin ~ admin:", admin);
            if (admin) {
                if (admin.role === 'admin') {
                    let payload = {
                        _id: String(admin === null || admin === void 0 ? void 0 : admin._id),
                        email: admin === null || admin === void 0 ? void 0 : admin.email,
                        role: admin === null || admin === void 0 ? void 0 : admin.role,
                    };
                    const accessToken = jsonwebtoken_1.default.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: "1h" });
                    console.log(accessToken, 'token');
                    res.cookie("user_jwt", accessToken, {
                        httpOnly: true,
                    });
                    res.status(200).json({
                        success: true,
                        user: admin,
                        message: "Admin verified!",
                    });
                }
                else {
                    res.status(401).json({ error: "Unauthorized: Insufficient role privileges" });
                }
            }
            else {
                res.status(401).json({ error: "Unauthorized" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    return loginAdmin;
};
exports.loginController = loginController;
