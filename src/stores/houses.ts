import { ref, watch } from 'vue'
import { defineStore } from 'pinia';
import { useQuery } from '@tanstack/vue-query';

import type { House, HousePoints } from '../types/house';

const fetchHouses = async () => {
  try {
    const response = await fetch('https://wizard-world-api.herokuapp.com/Houses');

    if (!response.ok) {
      throw new Error('Failed to fetch houses');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching houses:', error);
    throw error;
  }
};

export const useHousesStore = defineStore('houses', () => {

  const { data: houses, isLoading: isLoading, error } = useQuery({
    queryKey: ['houses'],
    queryFn: fetchHouses,
    retry: 2,
    staleTime: 1000 * 60 * 60,
  });

  const selectedHouse = ref<House | null>(null);
  const housesPoints = ref<HousePoints>({});

  watch(() => houses.value, (houses) => {
    if (houses) {
      const points: HousePoints = { ...housesPoints.value };
      houses.forEach((house: House) => {
        if (!(house.id in points)) {
          points[house.id] = 0;
        }
      });
      housesPoints.value = points;
    }
  }, { immediate: true });

  function incrementHousePoints(houseId: string, amount = 10) {
    if (houseId in housesPoints.value) {
      housesPoints.value[houseId] += amount;
    }
  }

  function selectHouse(house: House) {
    selectedHouse.value = house;
  }

  return {
    houses: houses,
    isLoading,
    error,
    selectedHouse,
    selectHouse,
    housesPoints,
    incrementHousePoints,
  };
});