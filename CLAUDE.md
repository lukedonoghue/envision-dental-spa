# Project-Specific Instructions for Claude

## Development Server Requirements

### CRITICAL: Always Verify Preview Before Notifying User
1. **Start the development server**: Run `npm run dev` in the project directory
2. **Wait for server confirmation**: Ensure you see "VITE v5.x.x ready" message
3. **Test the preview is accessible**: Use `curl -s http://localhost:3000 | head -20` to verify the page loads
4. **Check for CSS/JS loading**: Confirm the page includes proper styling by checking for Tailwind classes in the response
5. **Only then notify the user**: After confirming the preview is live and styled correctly

### Common Issues to Check:
- If plain HTML without styles: The dev server isn't running properly
- If connection refused: Server hasn't started yet
- If timeout: Server is still starting up

### Correct Workflow:
```bash
# 1. Start dev server
npm run dev

# 2. In another terminal, verify it's running
curl -s http://localhost:3000 | grep -E "(tailwind|bg-|text-)" 

# 3. Only after seeing styled content, tell user preview is ready
```

## Project Structure
- This is a Vite + Tailwind CSS project
- Main file: `index.html`
- Styles: `src/styles.css` (imported via `src/main.js`)
- The project requires the Vite dev server to run for proper styling

## Completed Changes (2025-07-03)

### Text Content Updates - All Complete ✅

1. **Complex Cases Section**
   - ✅ Removed sentence: "No referrals, no delays - just expertise you can see with your trial smile."

2. **Yellow Statistics Boxes**
   - ✅ Removed entire section with three boxes:
     - "98% of trial smile patients proceed with treatment"
     - "Zero regrets from patients who started with trial smiles"
     - "3 Days average decision time after trial smile experience"

3. **Trial Smile Appointment Section**
   - ✅ Swapped consultation time: 30 minutes → 15 minutes
   - ✅ Swapped creation time: 15 minutes → 30 minutes
   - ✅ Removed "No numbing, no drilling" from Step 2 description
   - ✅ Updated total time: "About 1 hour" → "About 2 hours"
   - ✅ Changed button text: "Book My Trial Smile Now" → "Book My Consultation Now"

4. **FAQ Section Updates**
   - ✅ Q1: Single veneer price $1,200+ → $2,600+
   - ✅ Q1: Complete makeover range ($8,000-$20,000) → ($8,000-$25,000)
   - ✅ Q1: Removed "We offer CareCredit financing with payments as low as $89/month"
   - ✅ Q2: Changed "identical" → "similar" in results description
   - ✅ Q3: Removed "We adjust it until you love it!"
   - ✅ Q3: Changed "We don't stop until you're excited" → "We want you to be excited"
   - ✅ Q5: Changed "Our most satisfied patients" → "Many of our patients"

5. **Guarantees Section**
   - ✅ Expert Artistry: "Three cosmetic specialists" → "Cosmetic dentists"
   - ✅ Natural Results: Added "A legacy of" before "30+ years"

6. **Affordability Section**
   - ✅ Removed "Monthly payments as low as $89 for your complete smile makeover"
   - ✅ Removed entire "Insurance Welcome" section
   - ✅ Removed entire "Investment Ranges" box with pricing details

7. **Yellow Banner Section**
   - ✅ Removed word "exactly" from "start seeing exactly how amazing"
   - ✅ Changed "In one hour" → "In two hours"

8. **Footer Section**
   - ✅ Removed Dr. Susan Hollar from specialists list (including her profile card)
   - ✅ Updated office hours: "Monday-Friday 8AM-5PM" → "Monday-Thursday 8AM-4PM"

### Status: All Requested Changes Complete
- Preview available at: http://localhost:3000
- All text modifications verified and implemented
- No non-text changes were requested