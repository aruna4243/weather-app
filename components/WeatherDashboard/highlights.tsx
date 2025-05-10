import { WeatherData } from "@/types/weather";
import {
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiThermometer,
  WiDaySunny,
  WiStars,
} from "react-icons/wi";
import { useTheme } from 'next-themes';
type HighlightsProps = {
  data: WeatherData;
};

function getUVLevel(uv: number) {
  if (uv <= 2) return { level: "Low", desc: "Very minimal risk from sunlight." };
  if (uv <= 5) return { level: "Moderate", desc: "Seek shade during midday." };
  if (uv <= 7) return { level: "High", desc: "Use sunscreen & sunglasses." };
  if (uv <= 10) return { level: "Very High", desc: "Avoid long sun exposure." };
  return { level: "Extreme", desc: "Stay indoors if possible." };
}

function getHumidityLevel(h: number) {
  if (h <= 30) return { level: "Dry", desc: "Air feels dry. Consider a humidifier." };
  if (h <= 60) return { level: "Comfortable", desc: "Ideal humidity level." };
  return { level: "Humid", desc: "May feel sticky or muggy." };
}

function getWindLevel(speed: number) {
  if (speed <= 2) return { level: "Calm", desc: "Barely noticeable breeze." };
  if (speed <= 5) return { level: "Light", desc: "Pleasant wind movement." };
  return { level: "Strong", desc: "Hold on to your hat!" };
}

function getPressureLevel(pressure: number) {
  if (pressure < 1000) return { level: "Low", desc: "Possible rain or clouds." };
  if (pressure < 1020) return { level: "Stable", desc: "Normal weather patterns." };
  return { level: "High", desc: "Likely clear and dry skies." };
}

function getVisibilityLevel(visibility: number) {
  if (visibility >= 10000) return { level: "Excellent", desc: "Crystal clear views." };
  if (visibility >= 5000) return { level: "Good", desc: "Mild haze." };
  return { level: "Poor", desc: "Low visibility—be cautious outside." };
}

export default function Highlights({ data }: HighlightsProps) {
   const { theme } = useTheme(); 
  const { wind, main, visibility } = data;

  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-300" : "text-gray-500";
  const cardBg = isDark ? "bg-[#333333]" : "bg-gray-200";
  const headingColor = isDark ? "text-white" : "text-gray-900";

  const uvMockValue = 6.3; 
  const uv = getUVLevel(uvMockValue);
  const humidity = getHumidityLevel(main.humidity);
  const windDesc = getWindLevel(wind.speed);
  const pressure = getPressureLevel(main.pressure);
  const visibilityDesc = getVisibilityLevel(visibility);

  const cards = [
    {
      icon: <WiDaySunny className="text-yellow-400 text-4xl" />,
      label: "UV Index",
      value: `${uvMockValue}`,
      level: uv.level,
      desc: uv.desc,
    },
    {
      icon: <WiHumidity className="text-blue-500 text-4xl" />,
      label: "Humidity",
      value: `${main.humidity}%`,
      level: humidity.level,
      desc: humidity.desc,
    },
    {
      icon: <WiStrongWind className="text-gray-500 text-4xl" />,
      label: "Wind",
      value: `${wind.speed} m/s`,
      level: windDesc.level,
      desc: windDesc.desc,
    },
    {
      icon: <WiBarometer className="text-orange-500 text-4xl" />,
      label: "Pressure",
      value: `${main.pressure} hPa`,
      level: pressure.level,
      desc: pressure.desc,
    },
    {
      icon: <WiThermometer className="text-yellow-600 text-4xl" />,
      label: "Visibility",
      value: `${visibility / 1000} km`,
      level: visibilityDesc.level,
      desc: visibilityDesc.desc,
    },
    {
      icon: <WiStars className="text-green-500 text-4xl" />,
      label: "Air Quality",
      value: "Good",
      level: "Healthy",
      desc: "Air is clean and breathable.",
    },
  ];

  return (
    <div className="space-y-4 pb-1">
      <h2 className={`text-2xl font-semibold ${headingColor}`}>
        🌤️ Smart Weather Highlights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`${cardBg} rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {card.icon}
                <h3 className={`text-lg font-medium ${textColor}`}>{card.label}</h3>
              </div>
              <p className={`text-2xl font-bold ${textColor}`}>{card.value}</p>
            </div>
            <div className="text-left text-sm">
              <p className="text-indigo-600 font-semibold">{card.level}</p>
              <p className={`${subTextColor}`}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
