<template>
  <div class="tooltip" :class="AttrClass">
    <span class="text" :class="customClass ? customClass.text : ''">
      {{ content }}
    </span>
    <span class="arrow" :class="customClass ? customClass.arrow : ''"></span>
  </div>
</template>

<script>
export default {
  name: "tooltip",
  props: {
    content: String,
    customClass: Object,
    AttrClass: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/colors", "../../sass/typography";
.tooltip {
  padding: 5px 0;
  color: transparent;
  .text {
    display: block;
    opacity: 0;
    animation: tooltip-body__in 0.2s ease-in 0.1s forwards;
    background-color: rgba($black, 0.6);
    font-size: $font-smaller;
    font-weight: 500;
    letter-spacing: 0.4px;
    padding: 5px 8px;
    border-radius: 3px 3px 0 3px;
    backdrop-filter: blur(1px);
  }
  .arrow {
    opacity: 0;
    animation: tooltip-arrow__in 0.1s ease-in forwards;
    position: absolute;
    bottom: 0;
    right: 0.2px;
    transform: translateY(calc(100% - 5px)) !important;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 5px 0 0;
    border-color: rgba($black, 0.8) transparent transparent transparent;
  }
}

@keyframes tooltip-body__in {
  from {
    opacity: 0;
    transform-origin: right;
    transform: scaleX(0);
    color: transparent;
  }
  to {
    opacity: 1;
    transform-origin: right;
    transform: scaleX(1);
    color: $white;
  }
}

@keyframes tooltip-arrow__in {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform-origin: bottom;
    transform: scaleY(1);
  }
}

.tooltip-arrow__closing {
  animation: tooltip-arrow__out 0.1s ease-in forwards !important;
}
.tooltip-text__closing {
  animation: tooltip-body__out 0.1s ease-in forwards !important;
}

@keyframes tooltip-body__out {
  from {
    opacity: 1;
    transform-origin: right;
    transform: scaleX(1);
    color: $white;
  }
  to {
    opacity: 0;
    transform-origin: right;
    transform: scaleX(0);
    color: transparent;
  }
}

@keyframes tooltip-arrow__out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
