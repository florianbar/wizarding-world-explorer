<script setup lang="ts">
import { onMounted } from 'vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

import { useHousesStore } from '../stores/houses'
import type { House } from '../types/house'

const store = useHousesStore()

onMounted(() => {
  document.title = 'Hogwarts Houses'
})
</script>

<template>
  <div>
    <Card class="mb-4">
      <template #title>Houses</template>
      <template #content>
        <p class="mb-4">Explore the different houses of the wizarding world.</p>

        <div v-if="store.isLoading" class="flex justify-center py-4">Loading houses...</div>
        <div v-else-if="store.error" class="text-red-500">An error occurred while loading houses.</div>
        <div v-else>
          <DataTable
            :value="store.houses"
            stripedRows
            paginator
            :rows="10"
            tableStyle="min-width: 50rem"
            v-model:selection="store.selectedHouse"
          >
            <Column field="name" header="Name" sortable></Column>
            <Column field="founder" header="Founder" sortable></Column>
            <Column header="House Points" sortable :sortField="(item: House) => String(store.housesPoints[item.id])">
              <template #body="slotProps">
                {{ store.housesPoints[slotProps.data.id] }}
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <div :class="'house-row ' + slotProps.data.name.toLowerCase()">
                  <Button
                    icon="fas fa-eye"
                    label="View Details"
                    @click="store.selectHouse(slotProps.data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <!-- House Detail Section -->
          <div v-if="store.selectedHouse" class="mt-4 p-4 border rounded">
            <h3 class="text-xl font-bold">Selected House Details</h3>
            <p>Name: {{ store.selectedHouse.name }}</p>
            <p>Founder: {{ store.selectedHouse.founder }}</p>
            <p>House Points: {{ store.housesPoints?.[store.selectedHouse.id] }}</p>

            <h4 class="text-lg font-semibold mt-2">Additional Information</h4>
            <p>Mascot: {{ store.selectedHouse.animal }}</p>

            <div v-if="store.selectedHouse.traits.length > 0">
              <h4 class="text-lg font-semibold mt-2">Traits</h4>
              <ul>
                <li v-for="(trait, index) in store.selectedHouse.traits" :key="index">
                  {{ trait.name }}
                </li>
              </ul>
            </div>

            <div v-if="store.selectedHouse.houseColors">
              <p>House Colors:</p>
              <ul>
                <li v-for="(color, index) in store.selectedHouse.houseColors" :key="index">
                  {{ color }}
                </li>
              </ul>
            </div>

            <div class="mt-4">
              <Button
                label="Award 10 Points"
                @click="
                  store.incrementHousePoints(store.selectedHouse.id)
                "
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.house-row {
  padding: 4px;
  margin: 2px 0;
  border-radius: 4px;
}

.gryffindor {
  background-color: rgba(174, 0, 1, 0.1);
}

.hufflepuff {
  background-color: rgba(240, 199, 94, 0.1);
}

.ravenclaw {
  background-color: rgba(34, 47, 91, 0.1);
}

.slytherin {
  background-color: rgba(26, 71, 42, 0.1);
}
</style>
