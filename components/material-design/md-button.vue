<template>
  <button
    :class="[
      'block bg-primary text-on-primary rounded-full py-2 px-5',
      'hover:cursor-pointer hover:bg-primary/88',
      'disabled:cursor-not-allowed disabled:bg-primary/12 disabled:text-on-surface/50',
    ]"
  >
    <slot></slot>
  </button>
</template>
