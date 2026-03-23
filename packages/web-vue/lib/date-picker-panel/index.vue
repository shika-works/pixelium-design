<template>
  <div class="pixelium px-date-picker-panel">
    <div class="px-date-picker-panel-weeks">
      <div v-for="week in weekDays" :key="week" class="px-date-picker-panel-week-item">{{ week }}</div>
    </div>

    <div class="px-date-picker-panel-grid">
      <div
        v-for="(item, index) in calendarDays"
        :key="index"
        :class="[
          'px-date-picker-panel-day-item',
          { 'px-date-picker-panel-day-item__not-current': !item.isCurrentMonth },
          { 'px-date-picker-panel-day-item__today': item.isToday }
        ]"
      >
        <span class="px-date-picker-panel-day-number">{{ item.day }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'DatePickerPanel'
})

interface Props {
  year: number;
  month: number;
}

const props = defineProps<Props>();

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

interface CalendarItem {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const calendarDays = computed(() => {
  const days: CalendarItem[] = [];
  const { year, month } = props;

  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const currentMonthDays = new Date(year, month, 0).getDate();
  const lastMonthDays = new Date(year, month - 1, 0).getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: lastMonthDays - i,
      month: month - 1,
      year: month === 1 ? year - 1 : year,
      isCurrentMonth: false,
      isToday: false
    });
  }

  for (let i = 1; i <= currentMonthDays; i++) {
    const isToday = `${year}-${month}-${i}` === todayStr;
    days.push({
      day: i,
      month,
      year,
      isCurrentMonth: true,
      isToday
    });
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      month: month + 1,
      year: month === 12 ? year + 1 : year,
      isCurrentMonth: false,
      isToday: false
    });
  }

  return days;
});
</script>

<style src="./index.less" lang="less"></style>