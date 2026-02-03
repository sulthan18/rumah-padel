# Testing Guide - Sandbox Mode

## ✅ Sandbox Configuration Complete

Midtrans Sandbox mode is now configured with demo credentials for testing.

### Server Status
- **Mode**: Sandbox (Testing)
- **Server Key**: `SB-Mid-server-GwUP8WRWqFY7cOE1tbXi09TI`
- **Client Key**: `SB-Mid-client-61XuGAwQ8Bj8LxSS`

### Court Availability
All 3 courts are now bookable:
- **Court 1**: Indoor Premium (Rp 150,000/hour)
- **Court 2**: Indoor Premium (Rp 150,000/hour)
- **Court 3**: Outdoor Standard (Rp 120,000/hour)

## Testing the Booking Flow

### 1. Navigate to Booking Page
```
http://localhost:3000/booking
```

### 2. Select Date & Court
- Choose any future date from the calendar
- Select **any of the 3 courts** (Court 1, 2, or 3)
- Pick available time slots

### 3. Checkout & Payment
- Fill in customer details (auto-filled if logged in)
- Click "Bayar" (Pay)
- Midtrans Sandbox popup will appear

### 4. Test Payment Methods

#### Credit Card (Success)
- Card Number: `4811 1111 1111 1114`
- Expiry: `01/25` or any future date
- CVV: `123`
- Result: ✅ Success

#### GoPay (Success)
- Select GoPay
- Click "Bayar" in the simulator
- Result: ✅ Success

#### Bank Transfer
- **BCA VA**: `5114 1234 5678`
- **Mandiri Bill**: Auto-approve in dashboard
- **BNI VA**: `8888 0000 0000 01`

## Important Notes

> [!IMPORTANT]
> These are **demo test credentials** for development only. For production, replace with your own keys from https://dashboard.sandbox.midtrans.com

## Troubleshooting

If payment popup shows "No payment channels available":
1. Verify server restarted after `.env` changes
2. Check browser console for Snap script load errors
3. Confirm using Sandbox URL (`app.sandbox.midtrans.com`)

## Documentation
- Midtrans Sandbox: https://dashboard.sandbox.midtrans.com
- Test Cards: https://docs.midtrans.com/docs/testing-payment
