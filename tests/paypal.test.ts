import { generateAccesstoken, paypal } from '../lib/paypal';

test('generates token from paypal', async () => {
    const tokenResponse = await generateAccesstoken();
    console.log(tokenResponse);
    expect(typeof tokenResponse).toBe('string');
    expect(tokenResponse.length).toBeGreaterThan(0);
});

test('creates a paypal order', async () => {
    const price = 10.0;
    const orderResponse = await paypal.createOrder(price);
    console.log(orderResponse);
    expect(orderResponse).toHaveProperty('id');
    expect(orderResponse).toHaveProperty('status');
    expect(orderResponse.status).toBe('CREATED');
});

test('simulate capturing a payment from an order', async () => {
    const orderId = '100';
    const mockCapturePayment = jest.spyOn(paypal, 'capturePayment').mockResolvedValue({
        status: 'COMPLETED',
    });
    const captureReponse = await paypal.capturePayment(orderId);
    expect(captureReponse).toHaveProperty('status', 'COMPLETED');
    mockCapturePayment.mockRestore();
});
