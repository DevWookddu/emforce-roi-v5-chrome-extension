<template>
  <div class="container">
    <div v-if="list.length === 0" class="row">
      <div class="col s12 m6">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">유입/전환 미발생</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else v-for="(call, i) in list" :key="i">
      <div v-if="call.url.includes('/click')" class="row">
        <div class="col s12 m6">
          <div class="card teal lighten-4">
            <div class="card-content black-text">
              <span class="card-title">{{ call.query.adv_id }} 유입</span>
              <div class="track">EKAMS: {{ call.query.cekams.split('_')[0] }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="call.params.ctype === 'v5'" class="row">
        <div class="col s12 m6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">{{ call.params.adv_id }} 전환 V5</span>
              <div class="track">EKAMS: {{ call.params.ekams.split('_')[0] }}</div>
              <div class="track">ID: {{ call.params.adv_conversion_id }}</div>
              <div class="track">emf_duplicate: {{ call.params.emf_duplicate }}</div>
              <button @click="view(call)">전환 정보 전체 보기</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="row">
        <div class="col s12 m6">
          <div class="card blue-grey lighten-1">
            <div class="card-content white-text">
              <span class="card-title">{{ call.query.advertiserId }} 전환 V4</span>
              <div class="track">EKAMS: {{ call.query.ekams.split('_')[0] }}</div>
              <div class="track">ID: {{ call.query.roiId }}</div>
              <button @click="view(call)">전환 정보 전체 보기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import queryString from 'query-string';

export default {
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    chrome.storage.local.get(['list'], result => {
      this.list = result.list.map(({ url, params }) => {
        return {
          url,
          query: this.parseQuery(url),
          params: params || {},
        };
      });
    });
  },
  methods: {
    parseQuery(url) {
      const query = url.split('?')[1];
      return queryString.parse(query || '');
    },
    view(call) {
      alert(JSON.stringify(call));
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-width: 500px;
}

.row {
  margin-bottom: 0px;
}

.track {
  font-size: 14px;
}

button {
  margin-top: 4px;
}
</style>
