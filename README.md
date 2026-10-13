# ❤️ Aaru & Nikku - Romantic Digital Surprise Gift

A romantic, interactive, single-page web application created with love by **Aaru** for **Nikku**.

---

## ✨ Features & Journey Flow

1. **Animated 3D Love Envelope & First Question**:
   - 3D wax-sealed envelope that opens on click.
   - Text: *"Aaru has sent some love for Nikku! ❤️"*
   - Question: *"Do you love me?"*
   - Playful **Runaway "No" button** that dodges cursor & touch, forcing her to pick "Yes"!

2. **The Best & Worst**:
   - Question: *"What are the best and worst things about me?"*
   - Interactive input fields with local memory saving.
   - **Kissing Emoji Action**: Upon submission, a giant animated kissing emoji (`😘`) bursts onto the screen with flutter kisses, sound effects, and floating hearts!

3. **Feelings**:
   - Question: *"How do you feel when you are with me?"*
   - Quick selectable feeling pills (*Safe & Protected 🛡️*, *Butterflies in stomach 🦋*, *Like I'm home 🏡*, etc.) + thoughtful text area.

4. **The Big Question**:
   - Question: *"Are you ready to marry me?"*
   - Sparkling diamond ring animation with celebratory chimes & confetti upon clicking "Yes"!

5. **Safe Place**:
   - Question: *"Do you feel comfortable and safe with me?"*
   - Reaffirming Aaru's lifetime promise to be Nikku's calmest shelter.

6. **The Love Letter**:
   - Frosted parchment vintage aesthetic with deep romantic words.
   - Romantic Hindi love Shayari:
     > *तेरी धड़कन ही ज़िन्दगी का किस्सा है मेरा,*  
     > *तू ज़िंदगी का एक अहम हिस्सा है मेरा,*  
     > *मेरी मोहब्बत सिर्फ लफ्जों की मोहताज नहीं,*  
     > *तेरी रूह से रूह तक का रिश्ता है मेरा। 💕*
   - Exact mandatory vows:
     - **"I love you Nikku so much ❤️"**
     - **"I want to live my all life with you ♾️👩❤️👨"**

7. **Photo Gallery**:
   - Polaroid-style cards featuring real pictures of Aaru and Nikku with delicate washi tape, romantic quotes, and a click-to-enlarge Lightbox modal!

8. **A Special Video (Custom Photo Montage Reel)**:
   - Beautifully framed video player with cute animated romantic border and floral corner accents.
   - Exact caption: **"for you my love nikuu"**.
   - Built exclusively using all 19 real photos of Aaru and Nikku with smooth Ken Burns zoom, dreamy bokeh crossfades, and synced **romantic love music**!
   - Full player controls: Play/Pause, scrubber, next/prev, mute/unmute, and video export button.

9. **The Grand Finale**:
   - Heartwarming final message reaffirming eternal love.
   - Continuous confetti & heart fireworks.
   - **"Send My Answers to Aaru on WhatsApp 💬"** button pre-fills her answers from the journey into WhatsApp!

---

## 🚀 How to Run & View Locally

You can open `index.html` directly in any web browser (Chrome, Edge, Safari, Firefox) simply by double-clicking it, or start a local server:

```powershell
# Using Python
python -m http.server 8000

# Or using Node.js (npx)
npx serve
```
Then visit: `http://localhost:8000`

---

## 🛠️ Easy Customization Guide for Aaru

### 1. Photos Included
All 19 of your photos are neatly stored in the `images/` directory:
- `images/photo1.jpg`: Sweet selfie together with flower in Nikku's hair 🌸
- `images/photo2.jpg`: "Better Together" romantic collage with forehead kiss 💖
- `images/photo3.jpg`: Magical night shot at Roorkee Institute of Technology ✨
- `images/photo4.jpg`: Standing together lovingly 🫂
- `images/photo5.jpg`: Sweet smiling portrait ♾️
- `images/photo6.jpg`: Holding hands facing each other under romantic lights 🤝❤️
- `images/photo7.jpg`: Sweet indoor selfie with Nikku in pink top 😊💕
- `images/photo8.jpg`: Night event celebration together 🥂✨
- `images/photo9.jpg`: Loving glance under night lights 🌹
- `images/photo10.jpg`: Full evening portrait together 📸💫
- `images/photo11.jpg`: Nikku looking breathtaking in red saree 👑❤️
- `images/photo12.jpg`: Radiant smile in pink embroidered kurti 💖
- `images/photo13.jpg`: Traditional yellow dress with golden jhumkas ☀️✨
- `images/photo14.jpg`: Outdoor sunshine smile with gentle colors 🎨💕
- `images/photo15.jpg`: Aaru and Nikku standing happily side by side 🌍♾️
- `images/photo16.jpg`: Royal elegance in traditional olive green suit 👑💚
- `images/photo17.jpg`: Prettier than garden flowers portrait 🌺✨
- `images/photo18.jpg`: Sweet innocent close-up with flower 🌸💫
- `images/photo19.jpg`: Peaceful loving expression portrait 🏡💖

### 2. Replacing the Video
In `index.html` on **Page 8 (Line ~446)**:
- **To use your own local video**:
  Replace the `<iframe>` tag with:
  ```html
  <video class="video-element" controls playsinline>
    <source src="my-video.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  ```
- **To use a YouTube video**:
  Update the `src` inside the `<iframe>` with your YouTube embed link:
  ```html
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
  ```

---

*Made with love for Nikku & Aaru ♾️*
