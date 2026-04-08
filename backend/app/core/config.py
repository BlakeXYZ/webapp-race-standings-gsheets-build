# ==============================================================================
# CONFIGURATION - Settings for the entire application
# ==============================================================================
# This file stores all configuration like environment variables, API settings, etc.
# Think of this as a central place for all your app's settings
# ==============================================================================

import os

from pydantic_settings import BaseSettings  # Helps load settings from .env files
from typing import List, Optional                     # For type hints


# ==============================================================================
# SETTINGS CLASS - Define all your application settings here
# ==============================================================================

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or defaults
    
    How it works:
    1. Looks for variables in .env file
    2. Falls back to defaults if not found
    3. Validates types automatically (will error if wrong type)
    """
    
    # ------------------------------------------------------------------
    # API METADATA - Basic info about your API
    # ------------------------------------------------------------------
    PROJECT_NAME: str = "Race Standings API"  # Name of your API
    VERSION: str = "1.0.0"                    # Version number
    API_V1_STR: str = "/api/v1"              # URL prefix for all routes
    
    
    # ------------------------------------------------------------------
    # CORS - Which websites can call this API
    # ------------------------------------------------------------------
    # This is a list of allowed origins (frontend URLs)
    # If frontend runs on different port/domain, add it here
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",   # Vite dev server (default)
        "http://localhost:3000",   # React dev server (alternative)
        "http://localhost:8080",   # Another common dev port
    ]
    # STUB: Add production domains here when deploying
    # Example: Add these to the list above or set via environment variable
    # "https://yourdomain.com",
    # "https://www.yourdomain.com",
    # "https://app.yourdomain.com",
    
    
    # ------------------------------------------------------------------
    # DATABASE - Connection settings (currently commented out)
    # ------------------------------------------------------------------
    # STUB: Uncomment and configure when you add a database
    # DATABASE_URL: str = "sqlite:///./race_standings.db"          # SQLite (simple)
    # DATABASE_URL: str = "postgresql://user:pass@localhost/dbname" # PostgreSQL
    # DATABASE_URL: str = "mysql://user:pass@localhost/dbname"      # MySQL
    
    
    # ------------------------------------------------------------------
    # AUTHENTICATION - API keys, JWT secrets, etc.
    # ------------------------------------------------------------------
    # STUB: Add authentication settings here
    # SECRET_KEY: str = "your-secret-key-change-in-production"
    # ALGORITHM: str = "HS256"
    # ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    
    # ------------------------------------------------------------------
    # EXTERNAL SERVICES - API keys for third-party services
    # ------------------------------------------------------------------
    # STUB: Add external service configuration here
    # STRIPE_API_KEY: str = ""
    # SENDGRID_API_KEY: str = ""
    # AWS_ACCESS_KEY: str = ""
    # AWS_SECRET_KEY: str = ""
    # GOOGLE_API_KEY: str = ""
    
    # Google Sheets API Configuration
    GSHEET_API_KEY: Optional[str] = None
    GOOGLE_API_SCOPES: List[str] = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None
    GSHEET_RALLYCROSS_ID: str = "1HA-DsQrd2pl4h0sOFE7N787MeVflVfMrnZOYu7fvgl4"


    
    
    # ------------------------------------------------------------------
    # PRODUCTION SETTINGS - Add these for production deployment
    # ------------------------------------------------------------------
    # STUB: Environment detection
    # ENVIRONMENT: str = "development"  # development, staging, production
    
    # STUB: Logging configuration
    # LOG_LEVEL: str = "INFO"           # DEBUG, INFO, WARNING, ERROR, CRITICAL
    # LOG_FILE: str = "app.log"
    
    # STUB: Security settings
    # SECURE_COOKIES: bool = False      # Set to True in production with HTTPS
    # ALLOWED_HOSTS: List[str] = ["*"]  # Restrict to specific domains in production
    
    # STUB: Rate limiting
    # RATE_LIMIT_PER_MINUTE: int = 60
    
    # STUB: Monitoring and error tracking
    # SENTRY_DSN: str = ""              # Error tracking with Sentry
    # ANALYTICS_ID: str = ""            # Google Analytics, etc.
    
    
    # ------------------------------------------------------------------
    # VPS DEPLOYMENT - Environment variables to set on production server
    # ------------------------------------------------------------------
    # Create /opt/race-standings/.env on your VPS with these variables:
    #
    # # Production API settings
    # PROJECT_NAME="Race Standings API - Production"
    # VERSION="1.0.0"
    # BACKEND_CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
    #
    # # Database (if using PostgreSQL)
    # DATABASE_URL=postgresql://user:password@localhost:5432/race_standings
    #
    # # Authentication
    # SECRET_KEY=your-super-secret-key-min-32-chars-long-change-this-in-production
    # ALGORITHM=HS256
    # ACCESS_TOKEN_EXPIRE_MINUTES=30
    #
    # # External services (if using)
    # STRIPE_API_KEY=sk_live_your_stripe_key
    # SENDGRID_API_KEY=SG.your_sendgrid_key
    #
    # # Monitoring (if using)
    # SENTRY_DSN=https://your-sentry-dsn
    # LOG_LEVEL=INFO
    #
    # # Security
    # ENVIRONMENT=production
    # SECURE_COOKIES=true
    #
    
    
    # ------------------------------------------------------------------
    # CONFIGURATION - How settings are loaded
    # ------------------------------------------------------------------
    class Config:
        env_file = ".env"          # Load from .env file if it exists
        case_sensitive = True      # Environment variables are case-sensitive
        # STUB: Add more config options
        # env_file_encoding = 'utf-8'
        # extra = 'ignore'  # Ignore extra fields in .env


# ==============================================================================
# CREATE SETTINGS INSTANCE - Use this throughout your app
# ==============================================================================

settings = Settings()

# Now you can import settings anywhere:
# from app.core.config import settings
# print(settings.PROJECT_NAME)


# ==============================================================================
# HOW TO USE ENVIRONMENT VARIABLES
# ==============================================================================
# 
# Create a .env file in the backend/ directory:
# 
# PROJECT_NAME="My Custom API Name"
# VERSION="2.0.0"
# DATABASE_URL="postgresql://user:pass@localhost/mydb"
# 
# These values will override the defaults above
# 
# IMPORTANT: Never commit .env to git! (already in .gitignore)
# ==============================================================================

