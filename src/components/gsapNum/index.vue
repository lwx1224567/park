<template>
  <div v-if="show" class="numcard numcardItem1">
    <span class="real-time-num gsapNum" ref="number" :style="{ color: textColor }">{{ formattedNumber }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
  number: {
    type: [Number, String],
    default: 0,
  },
  comma: {
    type: Boolean,
    default: false
  },
  delay: {
    type: [Number, String],
    default: 0,
  },
  color: {
    type: String,
    default: '#FFFFFF'
  }
});

const rawNumber = ref(0);
const show = ref(true);
const showComma = ref(props.comma);
const textColor = ref(props.color);

const formattedNumber = computed(() => {
  return showComma.value ? rawNumber.value.toLocaleString() : rawNumber.value;
});

const animateNumber = (start, end) => {
  gsap.to(rawNumber, {
    value: end,
    duration: 2,
    delay: parseFloat(props.delay),
    roundProps: 'value',
    ease: 'power1.out',
    onUpdate: () => {
      rawNumber.value = Math.round(rawNumber.value);
    },
  });
};

watch(() => props.number, (newVal) => {
  if (show.value) {
    rawNumber.value = 0;
    animateNumber(rawNumber.value, newVal);
  }
});

watch(show, () => {
  rawNumber.value = 0;
  animateNumber(rawNumber.value, props.number);
});

watch(() => props.comma, (newVal) => {
  showComma.value = newVal;
});

watch(() => props.color, (newVal) => {
  textColor.value = newVal;
});

onMounted(() => {
  if (show.value) {
    rawNumber.value = 0;
    animateNumber(rawNumber.value, props.number);
  }
});
</script>

<style lang="scss" scoped>
.numcardItem1 {
  .real-time-num {
    width: auto !important;
    font-size: 22px;
    font-family: UniDream;
    font-weight: normal;
    animation: slideUp 1s forwards;
    text-shadow: 0 0 20px #0995ff;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>