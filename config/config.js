const config = {
  env: process.env.NODE_ENV || 'development', 
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key", 
  mongoUri: "mongodb+srv://alyssamichellegreen22_db_user:PortfolioPass123@cluster0.ir4nwov.mongodb.net/Portfolio?retryWrites=true&w=majority"
};

export default config;
