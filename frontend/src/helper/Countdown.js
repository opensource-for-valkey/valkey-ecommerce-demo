// Countdown Timer Function
function countdown(targetDate) {
  const now = new Date().getTime(); // Get current time in milliseconds
  const timeLeft = targetDate.getTime() - now; // Calculate time difference

  if (timeLeft > 0) {
    // Calculate time components
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Return countdown values
    return { days, hours, minutes, seconds };
  } else {
    // If countdown ends, return zeroes
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
}

// Target date
const targetDate = new Date("2025-12-31T00:00:00"); // Set your target date here

// Export the function to get the current countdown
export function getCountdown() {
  return countdown(targetDate);
}
