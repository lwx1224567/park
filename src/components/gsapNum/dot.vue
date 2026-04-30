<template>
  <div v-if="show" class="numcard numcardItem1">
    <span class="real-time-num gsapNum" ref="number">{{ formattedNumber }}</span>
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
  precision: {
    type: Number,
    default: 1
  },
  delay: {
    type: [Number, String],
    default: 0,
  },
});

const rawNumber = ref(0);
const show = ref(true);
const showComma = ref(props.comma);

const formattedNumber = computed(() => {
  if (showComma.value) {
    return parseFloat(rawNumber.value).toLocaleString('en-US', {
      maximumFractionDigits: props.precision,
      minimumFractionDigits: props.precision
    });
  }
  return parseFloat(rawNumber.value).toFixed(props.precision);
});

const animateNumber = (start, end) => {
  gsap.to(rawNumber, {
    value: end,
    duration: 2,
    delay: parseFloat(props.delay),
    ease: 'power1.out',
    onUpdate: () => {
      rawNumber.value = parseFloat(rawNumber.value).toFixed(props.precision);
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

onMounted(() => {
  showComma.value = props.comma;
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
    animation: slideUp 1s forwards;
    color: #FFF;
    font-family: led;
    font-size: 45px;
    font-style: normal;
    font-weight: normal;
    text-shadow:0 0 20px #0995ff;
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
