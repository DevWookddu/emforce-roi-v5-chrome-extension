<template>
  <p>{{ list }}</p>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    chrome.storage.sync.get(['list'], result => {
      this.list = result.list;
    });
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
