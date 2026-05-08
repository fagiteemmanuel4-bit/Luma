import asyncio
from playwright.async_api import async_playwright
import os
import subprocess

async def verify():
    # Kill any existing process on port 3000
    subprocess.run("kill $(lsof -t -i :3000) 2>/dev/null || true", shell=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Start the dev server
        process = await asyncio.create_subprocess_shell('cd app && npm run dev -- --port 3000')
        await asyncio.sleep(8)  # Wait longer for server to start

        try:
            # Home
            print("Verifying Home...")
            await page.goto('http://localhost:3000/')
            await page.wait_for_selector('text=Screenix', timeout=10000)
            await page.screenshot(path='verification/final_home.png')

            # Pricing
            print("Verifying Pricing...")
            await page.goto('http://localhost:3000/pricing')
            await page.wait_for_selector('text=Simple Pricing', timeout=10000)
            await page.screenshot(path='verification/final_pricing.png')

            # Movies Browse
            print("Verifying Movies...")
            await page.goto('http://localhost:3000/movies')
            await page.wait_for_selector('text=Movies', timeout=10000)
            await page.screenshot(path='verification/final_movies.png')

            # Details
            print("Verifying Details...")
            await page.goto('http://localhost:3000/details/movie/123')
            await page.wait_for_selector('text=Interstellar', timeout=10000)
            await page.screenshot(path='verification/final_details.png')

            # Watch
            print("Verifying Watch...")
            await page.goto('http://localhost:3000/watch/movie/123')
            await page.wait_for_selector('text=Interstellar', timeout=10000)
            await page.screenshot(path='verification/final_watch.png')

            # Login Error Simulation
            print("Verifying Login Suspension...")
            await page.goto('http://localhost:3000/login')
            await page.wait_for_selector('input[id="email"]', timeout=10000)
            await page.fill('input[id="email"]', 'suspended@user.com')
            await page.fill('input[id="password"]', 'password')
            await page.click('button[type="submit"]')
            await page.wait_for_selector('text=Account Suspended', timeout=10000)
            await page.screenshot(path='verification/final_login_suspended.png')
            print("Verification Complete.")

        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path='verification/error_screenshot.png')
        finally:
            process.kill()
            await browser.close()

if __name__ == "__main__":
    os.makedirs('verification', exist_ok=True)
    asyncio.run(verify())
