module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cyberBg: "#06070a",
        neonCyan: "#00F5FF",
        neonMagenta: "#FF3DAB",
        glass: "rgba(255,255,255,0.06)"
      },
      boxShadow: {
        'neon': '0 10px 30px rgba(0,245,255,0.06), inset 0 1px 0 rgba(255,255,255,0.03)'
      }
    },
  },
  plugins: [],
};
