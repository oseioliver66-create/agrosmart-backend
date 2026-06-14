"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const detect_1 = __importDefault(require("./routes/detect"));
const listings_1 = __importDefault(require("./routes/listings"));
const orders_1 = __importDefault(require("./routes/orders"));
const payments_1 = __importDefault(require("./routes/payments"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'AgroSmart API is running 🌿',
        version: '1.0.0',
        endpoints: ['/detect', '/listings', '/orders', '/payments']
    });
});
// Routes
app.use('/detect', detect_1.default);
app.use('/listings', listings_1.default);
app.use('/orders', orders_1.default);
app.use('/payments', payments_1.default);
app.listen(PORT, () => {
    console.log(`🌿 AgroSmart backend running on port ${PORT}`);
});
exports.default = app;
