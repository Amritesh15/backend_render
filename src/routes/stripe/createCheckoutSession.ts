import express, { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { sendConfirmationEmail } from '../../utils/emailSender';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const router = express.Router();


router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
  const { packageTier, customerEmail, ...formData } = req.body;
  const { propertyRequestId } = req.body;


  const priceMap: Record<string, string> = {
    basic: process.env.PRICE_BASIC!,
    standard: process.env.PRICE_STANDARD!,
    premium: process.env.PRICE_PREMIUM!,
  };

  const validTiers = ['basic', 'standard', 'premium'] as const;
  const priceId = priceMap[packageTier];

  if (!validTiers.includes(packageTier)) {
    res.status(400).json({ error: 'Invalid package tier' });
    return;
  }
  console.log(' Received propertyRequestId:', propertyRequestId);
  console.log(' Checkout body received:', req.body);


  try {
    const session = await stripe.checkout.sessions.create({
      
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cancel',
      metadata: {
        
        propertyRequestId: propertyRequestId.toString() 
      }
    });

    try {
      const fullFormData = {
        ...formData.formData,
        selectedPackage: packageTier
      };
      
      //await sendConfirmationEmail(customerEmail, fullFormData);
      
    } catch (emailErr) {
      console.warn('Email sending failed:', emailErr);
    }

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

export default router;
