# DopeTech Admin Dashboard

## 🚀 Admin Access

### How to Access
1. **Direct URL Access**: Navigate directly to `/doptechadmin` after the site URL
   - **Example**: `http://localhost:3001/doptechadmin`
2. **Enter Password**: Use the admin password: `dopetech2024`
3. **Access Dashboard**: After successful login, you'll have full admin access

### 🔐 Security Features
- **Hidden from Public**: No admin buttons visible to regular users
- **Direct URL Access**: Only accessible via direct URL entry
- **Session Management**: 8-hour admin sessions with localStorage
- **Password Protection**: Secure login screen with password validation

### Admin Dashboard Features

#### 📊 Analytics Dashboard
- **Total Products**: View count of all products in inventory
- **Total Sales**: Track revenue in Rs (Nepalese Rupees)
- **Total Views**: Monitor product page visits
- **Interactions**: Track user engagement metrics

#### 🏆 Top Products & Recent Activity
- **Top Products**: See the 5 highest-rated products
- **Recent Activity**: Monitor sales, views, and interactions in real-time
- **Activity Types**: 
  - 💰 Sales (green)
  - 👁️ Views (blue) 
  - 📈 Interactions (purple)

#### 🛍️ Product Management
- **Add New Products**: Complete form with all product details
- **Edit Products**: Modify existing product information
- **Delete Products**: Remove products from inventory
- **Search & Filter**: Find products by name or category
- **Stock Management**: Track product availability

### Product Management Fields

When adding/editing products, you can set:

| Field | Type | Description |
|-------|------|-------------|
| Product Name | Text | Full product name |
| Category | Dropdown | Keyboards, Mouse, Audio, Speakers, Monitors, Accessories |
| Price (Rs) | Number | Current selling price |
| Original Price (Rs) | Number | MSRP for discount calculations |
| Description | Text | Product description |
| Image URL | Text | Product image link |
| Rating | Number (0-5) | Product rating with decimals |
| Reviews Count | Number | Number of customer reviews |
| Discount (%) | Number (0-100) | Percentage discount |
| In Stock | Checkbox | Product availability |

### 🔐 Security Notes

- **Password**: `dopetech2024` (for development only)
- **Session**: Admin session expires after 8 hours
- **Hidden Access**: No visible admin buttons on main site
- **Production**: Implement proper authentication for live deployment

### 🎨 UI Features

- **Dark Theme**: Consistent with DopeTech branding
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live analytics and activity tracking
- **Smooth Animations**: Professional user experience
- **Yellow Accents**: Brand color (#F7DD0F) throughout
- **Secure Login**: Professional login screen with lock icon

### 📱 Mobile Optimization

The admin dashboard is fully responsive and optimized for:
- **Touch Targets**: Large, easy-to-tap buttons
- **Readable Text**: Appropriate font sizes for mobile
- **Swipe Gestures**: Touch-friendly interactions
- **Modal Dialogs**: Mobile-optimized forms

### 🚀 Quick Start

1. **Navigate to**: `http://localhost:3001/doptechadmin`
2. **Enter password**: `dopetech2024`
3. **Start managing**: Your DopeTech inventory!

### 🔗 Navigation

- **View Site**: Button to return to main site
- **Logout**: Secure logout with session cleanup
- **Back to Main**: Easy navigation back to public site

---

**Note**: This is a development version. For production deployment, implement proper authentication, database integration, and security measures.
