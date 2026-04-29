import { generateAccesstoken } from '../lib/paypal';

test('generates token from paypal', async () => {
    const tokenResponse = await generateAccesstoken();
    console.log(tokenResponse);
    expect(typeof tokenResponse).toBe('string');
    expect(tokenResponse.length).toBeGreaterThan(0);
});
