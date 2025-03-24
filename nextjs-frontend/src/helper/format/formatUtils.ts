export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Đảm bảo rằng giây luôn có 2 chữ số
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Nếu giờ và phút đều = 0, trả về SS, nếu chỉ giờ = 0, trả về MM:SS
  if (hours === 0 && minutes === 0) {
    return `0:${formattedSeconds}`;
  } else if (hours === 0) {
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  } else {
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemainder = Math.round(seconds) % 60;
  const paddedSeconds = `0${secondsRemainder}`.slice(-2);
  return `${minutes}:${paddedSeconds}`;
};

export const formatTimeAgo = (dateString: string): string => {
  const now = new Date().getTime(); // Chuyển sang millisecond
  const date = new Date(dateString).getTime(); // Chuyển sang millisecond
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
};
