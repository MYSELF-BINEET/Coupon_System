# Round-Robin Coupon Distribution System

## Overview

This document outlines the implementation plan for a live web application that distributes coupons to guest users in a round-robin manner while providing an admin panel to manage coupons and prevent abuse.

## System Architecture

### Tech Stack

- **Frontend**: React.js + Vite with Tailwind Css for responsive design
- **Backend**: Node.js with Express
- **Database**: MongoDB for coupon and user tracking storage
- **Authentication**: JWT for admin authentication
- **Deployment**: Vercel for live hosting

### Core Components

1. **User-Facing Coupon Distribution Module**
2. **Abuse Prevention System**
3. **Admin Authentication Module**
4. **Admin Coupon Management Panel**
5. **Analytics and Reporting Module**

## Detailed Implementation Plan

### 1. Database Schema

#### Coupon Collection
```javascript
  code: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    uppercase: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  value:{
    type: String,
    // required: true
  },
  expiryDate:{
    type: Date,
    required: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isUsed: { 
    type: Boolean, 
    default: false 
  },
  dateCreated: { 
    type: Date, 
    default: Date.now 
  }
});
```

#### Claim Tracking Collection
```javascript
 couponId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Coupon', 
    required: true 
  },
  ipAddress: { 
    type: String, 
    required: true 
  },
  browserFingerprint: { 
    type: String, 
    required: true 
  },
  dateTime: { 
    type: Date, 
    default: Date.now 
  }
});
```

#### Admin Collection
```javascript
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});
```

### 2. API Endpoints

#### Public Endpoints
- `GET /api/coupons/claim-coupon` - Claim a coupon (round-robin distribution)
- `GET /api/check-availability` - Check system availability and cooldown status

#### Admin Endpoints (Authenticated)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/coupons` - List all coupons with filtering options
- `POST /api/admin/coupons` - Add new coupons (single or batch)
- `PUT /api/admin/coupons/:id` - Update a coupon
- `PATCH /api/admin/coupons/:id/status` - Toggle coupon availability
- `GET /api/admin/claims` - View claim history with filtering


### 3. Coupon Distribution Logic

```javascript
 /**
   * Check if coupons are available
   */
  async checkAvailability() {
    const availableCoupons = await Coupon.countDocuments({ 
      isActive: true, 
      isUsed: false 
    });
    
    return { available: availableCoupons > 0, count: availableCoupons };
  }
  
  /**
   * Claim a coupon using round-robin approach
   */
  async claimCoupon(ipAddress, browserFingerprint) {
    // Find an available coupon using round-robin approach
    const coupon = await Coupon.findOneAndUpdate(
      { isActive: true, isUsed: false },
      { isUsed: true },
      { new: true, sort: { dateCreated: 1 } } // Get the oldest available coupon first
    );

    // console.log(ipAddress);
    
    if (!coupon) {
      throw new Error('No coupons available at this time');
    }
    
    // Record the claim
    await Claim.create({
      couponId: coupon._id,
      ipAddress,
      browserFingerprint
    });
    
    return {
      success: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        description: coupon.description
      },
      ipAddress:ipAddress,
      browserFingerprint:browserFingerprint
    };
  }


   /**
   * Generate a fingerprint cookie if not present
   */
  generateFingerprint(req, res) {
    const fingerprint = req.cookies.browserFingerprint || uuidv4();

    // console.log(fingerprint);
    
    // Set cookie if not already set
    if (!req.cookies.browserFingerprint) {
      res.cookie('browserFingerprint', fingerprint, {
        // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }
    
    return fingerprint;
  }
}


// Check for recent claims within cooldown period
    const recentClaim = await Claim.findOne({
      $or: [
        { ipAddress },
        { browserFingerprint }
      ],
      dateTime: { $gt: new Date(Date.now() - COUPON_COOLDOWN_MS) }
    });

    // console.log(recentClaim);
    
    if (recentClaim) {
      // Calculate remaining cooldown time in minutes
      const cooldownRemaining = Math.ceil(
        (COUPON_COOLDOWN_MS - (Date.now() - recentClaim.dateTime)) / (60 * 1000)
      );

      console.log(cooldownRemaining);
      
      return res.status(428).json({
        data:{
          message: 'You recently claimed a coupon. Please try again later.',
          cooldownRemaining:cooldownRemaining
        }
      });
    }

    
    next();
  } catch (error) {
    console.error('Claim check error:', error);
    next(error);
  }
};


exports.apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
});

// Stricter limiter for public coupon claiming
exports.couponClaimLimiter = rateLimit({
  windowMs: COUPON_COOLDOWN_MS, // Configurable cooldown period
  max: 5, // 5 requests per IP during cooldown period
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
});

```

### 4. Abuse Prevention Mechanisms

1. **IP Address Tracking**
   - Store and validate IP addresses against previous claims
   - Implement cooldown periods based on IP

2. **Browser Session Tracking**
   - Use HTTP-only cookies to track browser sessions
   - Prevent multiple claims from the same session

3. **Combined Validation**
   - Check both IP and session identity to prevent circumvention
   - Use MongoDB queries to efficiently check for previous claims

4. **Rate Limiting**
   - Implement Express rate limiter middleware
   - Gradually increase cooldown for repeated attempts

### 5. Admin Panel Features

1. **Dashboard**
   - Overview of coupon status (available, claimed, disabled)
   - Recent claims activity
   - System health indicators

2. **Coupon Management**
   - Tabular view with sorting and filtering
   - Bulk upload via CSV
   - Quick status toggle actions
   - Edit individual coupon details

3. **User Activity Monitoring**
   - View claim patterns by IP address
   - Identify potential abuse patterns
   - Export data for further analysis

4. **Settings**
   - Configure cooldown periods
   - Adjust security parameters
   - Manage admin accounts

### 6. Frontend Implementation

#### User Interface
- Simple, clean design focused on the coupon claim process
- Clear feedback messages for successful claims or restrictions
- Responsive design for mobile and desktop users

#### Admin Interface
- Secure login page
- Dashboard with key metrics
- Comprehensive coupon management interface
- User-friendly data visualization for tracking and analytics

### 7. Deployment Strategy

1. **Development Environment**
   - Local setup with Docker Compose
   - MongoDB Atlas for database

2. **Testing Environment**
   - Automated tests for critical functions
   - Load testing for coupon distribution system

3. **Production Deployment**
   - Heroku or Vercel for hosting
   - MongoDB Atlas (production cluster)
   - Setup environment variables for sensitive information
   - Configure proper CORS and security headers

## Setup Instructions

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/MYSELF-BINEET/Coupon_System.git
   cd Coupon_System
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   ```bash
   # In server directory, create .env file
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/coupon-system
   JWT_SECRET=your_jwt_secret_key
   COOLDOWN_PERIOD=86400000  # 24 hours in milliseconds
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev
   
   # Start frontend in another terminal
   cd client
   npm start
   ```

### Production Deployment

1. Create accounts on deployment platforms (Heroku, Vercel, MongoDB Atlas)
2. Configure environment variables on the hosting platform

## Security Considerations

1. **Data Protection**
   - Store only necessary user information
   - Hash and salt admin passwords
   - Use HTTPS for all connections

2. **API Security**
   - Implement proper authentication for admin endpoints
   - Rate limiting on public endpoints
   - Input validation for all requests

3. **Frontend Security**
   - CSRF protection
   - XSS prevention
   - Secure cookie handling

## Monitoring and Maintenance

1. **Error Logging**
   - Implement error tracking with tools like Sentry
   - Set up alerts for critical errors

2. **Performance Monitoring**
   - Track API response times
   - Monitor database performance

3. **Regular Updates**
   - Schedule security patches
   - Review and update dependencies

## Testing Credentials (for evaluation)

Admin access:
- URL: https://coupondistributionsystem.netlify.app/api/admin
- Username: admin
- Password: will be provided separately for security
