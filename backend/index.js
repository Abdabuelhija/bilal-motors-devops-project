// index.js
const cors = require("cors");
const express = require("express");
const client = require("prom-client"); // 1. استدعاء مكتبة Prometheus
const config = require("./services/config");
const db = require("./services/db");
const app = express();
const http = require("http").createServer(app);

// --- إعدادات المراقبة (Prometheus) ---
const register = new client.Registry();
// جمع المقاييس الافتراضية للنظام (CPU, Memory, Event Loop)
client.collectDefaultMetrics({ register });

// إنشاء مقياس مخصص لحساب عدد الطلبات لكل مسار (Route)
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

// Middleware لتسجيل كل طلب يدخل السيرفر
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
    });
    next();
});

// Endpoint الخاص بـ Prometheus لسحب البيانات
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});
// ------------------------------------

app.use(express.json());

app.use(cors({
  origin: config.ORIGIN,
  credentials: true
}));

const UserRoutes = require("./routes/admin.route");
app.use("/Admin", UserRoutes);

const carRoutes = require('./routes/cars.route');
app.use('/cars', carRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to bilal-motors server , made by the developer abd abuelhija')
});

http.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
}).on("error", (err) => {
    console.error(`Error starting server: ${err}`);
});