// hooks/useFavorites.ts
import { useEffect, useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);


  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    };

    sync();


    window.addEventListener("favorites-updated", sync);

    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("favorites-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const updateFavorites = (updatedList: string[]) => {
    localStorage.setItem("favorites", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("favorites-updated")); 
    setFavorites(updatedList);
  };

  const addFavorite = (city: string) => {
    if (!favorites.includes(city)) {
      updateFavorites([...favorites, city]);
    }
  };

  const removeFavorite = (city: string) => {
    updateFavorites(favorites.filter((c) => c !== city));
  };

  return { favorites, addFavorite, removeFavorite };
}
