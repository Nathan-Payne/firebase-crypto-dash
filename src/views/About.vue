<template>
  <div class="white--text">
    <v-container class="min-h-screen px-14 py-16 d-flex flex-column" fluid>
      <div class="pa-md-12">
        <h1 class="display-3 font-weight-bold">About</h1>
        <h3 class="display-1 mt-6">Binance Orderbooks, Prices, Chart Data</h3>
      </div>
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
          lg="5"
          class="pt-12 pa-md-12 leading-relaxed d-flex flex-column align-center "
        >
          <p>
            This site pulls data from the
            <a
              href="https://binance-docs.github.io/apidocs/spot/en/#change-log"
              target="_blank"
              class="accent--text"
              >Binance exchange API</a
            >
            and displays it in several formats. Where needed the data is
            manipulated into a more presentable/useful format (such as the
            orderbook being shown in summed ranges).
          </p>
          <p class="mt-6">
            This is a personal project I work on in my spare time and will
            undergo changes over an extended period. Below I outline the
            sections of the interface and how they were implemented. Check out
            my work at
            <a
              href="https://nathanpayne.dev"
              target="_blank"
              class="accent--text"
              >nathanpayne.dev</a
            >.
          </p>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="6" class=" mt-10 mt-md-0">
          <img
            id="binance-logo"
            :src="binanceLogo"
            alt="Binance Logo"
            class="mt-md-16"
          />
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
    </v-container>
    <!-- LIGHTWEIGHT CHARTS -->
    <v-container class="h-screen px-14 dark" fluid>
      <v-row
        no-gutters
        class="fill-height pb-16 d-flex justify-md-center align-center"
      >
        <v-col cols="12" md="4" class="d-flex flex-column align-md-end">
          <svg
            width="92"
            height="56"
            viewBox="0 0 92 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M87.5096 9.17833C88.8483 6.37042 90.1087 3.31636 91.2664 0L88.4861 0.788084C87.4704 3.54527 86.3838 6.10206 85.2428 8.47031C76.4834 13.8751 65.9901 12.8237 58.3572 8.60601L56.6002 7.54733C56.3234 8.93097 56.5748 10.4745 56.6928 11.199L56.7131 11.324C56.8231 12.0128 57.0023 12.8068 57.227 13.6432C57.4596 14.5093 57.7456 15.4382 58.0648 16.3667C57.299 15.8335 56.5494 15.0829 55.8593 14.1224C54.519 12.2572 53.4895 9.70967 53.0826 6.8229L52.9826 6.1134L52.3061 5.87718C34.6184 -0.299498 11.7551 6.4745 1.46645 24.1489L1.19385 24.6172L1.37285 25.1286C5.30395 36.3603 14.5495 46.4481 25.7847 51.2231L26.0051 51.3167L26.2469 51.3167L26.2498 51.3167L26.2576 51.3167L26.2807 51.3164L26.3136 51.3159L26.3564 51.3148C26.4197 51.313 26.5086 51.3096 26.6219 51.303C26.8483 51.2899 27.172 51.2643 27.5821 51.2142C28.4022 51.1139 29.5686 50.9157 30.9946 50.5236C33.2974 49.8903 36.2744 48.7519 39.5583 46.7077C39.3616 47.2602 39.1137 47.8358 38.8197 48.412C38.0137 49.9918 36.6163 51.9233 33.8479 53.8152L36.4041 54.3005C47.55 56.4168 60.6537 53.1714 70.7962 45.4072C80.9608 37.626 88.191 25.2739 87.5096 9.17833ZM83.3598 12.1248C75.2296 15.7745 66.2539 14.9207 59.1637 11.6473C59.2519 12.0705 59.3642 12.5369 59.4975 13.0334C59.9197 14.6051 60.5347 16.4146 61.1978 18.006L61.9929 19.9142C59.2451 19.8903 55.5224 17.6827 53.95 15.4943C52.4837 13.4537 51.385 10.8073 50.8689 7.8728C34.397 2.47969 13.4459 8.81566 3.77533 24.864C5.39063 29.2717 7.87524 33.4876 10.9958 37.221L30.9334 22.0187C30.435 21.1282 30.1509 20.1016 30.1509 19.0087C30.1509 15.6003 32.914 12.8372 36.3224 12.8372C39.7308 12.8372 42.4939 15.6003 42.4939 19.0087C42.4939 20.209 42.1512 21.3294 41.5583 22.2771L50.2468 30.9656C51.3394 29.9847 52.784 29.3881 54.3679 29.3881C57.2767 29.3881 59.7155 31.4004 60.368 34.1089C67.267 31.6824 76.1439 25.2262 83.3598 12.1248ZM60.4588 36.5594C68.0127 34.1292 77.5012 27.3688 85.1337 13.7696C84.406 26.8349 78.0142 36.9209 69.3671 43.5404C60.3893 50.413 49.0149 53.5211 39.0791 52.3353C39.7802 51.4673 40.4041 50.4797 40.9139 49.4805C41.8103 47.7236 42.4421 45.7576 42.4421 44.1324L42.4421 41.8126L40.5714 43.1844C36.6025 46.095 32.9802 47.5392 30.3712 48.2567C29.0658 48.6156 28.0131 48.7929 27.2969 48.8805C26.9388 48.9243 26.665 48.9456 26.486 48.9559L26.466 48.9571C21.2488 46.6967 16.4829 43.2134 12.5547 38.9889L32.4528 23.8166C33.5113 24.6696 34.8572 25.1802 36.3224 25.1802C37.6802 25.1802 38.9357 24.7416 39.9548 23.9985L48.8165 32.8602C48.4193 33.6756 48.1964 34.5915 48.1964 35.5595C48.1964 38.968 50.9595 41.731 54.3679 41.731C57.4359 41.731 59.981 39.4923 60.4588 36.5594ZM40.1428 19.0087C40.1428 21.1186 38.4324 22.8291 36.3224 22.8291C34.2124 22.8291 32.5019 21.1186 32.5019 19.0087C32.5019 16.8987 34.2124 15.1882 36.3224 15.1882C38.4324 15.1882 40.1428 16.8987 40.1428 19.0087ZM54.3679 39.38C56.3008 39.38 58.0708 37.7789 58.0708 35.5595C58.0708 33.3402 56.3008 31.7391 54.3679 31.7391C52.435 31.7391 50.665 33.3402 50.665 35.5595C50.665 37.7789 52.435 39.38 54.3679 39.38Z"
              fill="white"
            />
          </svg>
          <h2 class="display-2 font-weight-bold mt-10">Lightweight Charts</h2>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="5" class="pa-md-16 mt-n16 mt-md-6 leading-relaxed">
          <p>
            <a
              href="https://www.tradingview.com/lightweight-charts/"
              target="_blank"
              >Lightweight Charts</a
            >
            is an open-source charting library chosen for its familiar interface
            to potential users of this kind of financial data. The chart is
            customisable, updates in realtime and can be set up to be responsive
            using the
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver"
              target="_blank"
              >Resize Observer</a
            >
            interface.
          </p>
          <p class="mt-6">
            The data is sourced from both the REST API and the Binance
            websocket. The RSET API provides the historical candlesticks while
            the websocket provides update to the open, high, low and close
            values of the latest candlestick.
          </p>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
    <!-- CHARTS.JS ORDERBOOK DPETH CHART -->
    <v-container class="min-h-screen px-14 d-flex align-center" fluid>
      <v-row class="pb-16">
        <v-col cols="12" md="8">
          <v-row no-gutters>
            <v-col cols="12">
              <h1 class="display-3 font-weight-bold">Charts.js</h1>
            </v-col>
            <v-col cols="12">
              <h3 class="display-1 mt-6">Orderbook data structures</h3>
            </v-col>
          </v-row>

          <v-row no-gutters class="mt-14">
            <v-col cols="12" class="leading-relaxed">
              <p>
                In short, an orderbook is a record of all limit orders on an
                exchange. These orders show the intent to buy or sell at a
                predetermined price level and the amount to be traded should the
                price reach that level.
              </p>
              <p class="mt-6">
                The binance REST API delivers the data as two arrays (plus a
                timestamp), each array contains potentially thousands more
                arrays with two values: price and amount. This app takes the
                data:
              </p>
              <ul class="mt-6">
                <li class="mt-2">
                  Sorts and spreads the data into a single array
                </li>
                <li class="mt-2">
                  Sums the amounts of all orderbook levels within a set range,
                  starts summing from $1000 below to $1000 above current price
                  (obtained from websocket)
                </li>
                <li class="mt-2">
                  Splits the data into axes labels/data compatible with chart.js
                </li>
                <li class="mt-2">
                  Dynamically colors chart.js bars green if the summed levels
                  are below current price and red if they are above it
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="4" class="h-full pl-14 pt-12 my-auto">
          <v-img
            max-height="500"
            contain
            id="orderbook-example"
            src="../assets/orderbookExample.jpg"
            alt="Orderbook Example"
          />
        </v-col>
      </v-row>
    </v-container>
    <!-- TICKERS + WEBSOCKET -->
    <v-container
      class="min-h-screen px-14 pb-16 dark d-flex align-center"
      fluid
    >
      <v-row no-gutters class=" d-flex justify-md-center align-center">
        <v-col
          cols="12"
          md="6"
          class="pa-md-16 d-flex flex-column align-left justify-space-between"
        >
          <h2 class="display-3 mt-10 font-weight-bold">Live Tickers</h2>
          <div class="mt-16 pr-16">
            <data-ticker />
          </div>
        </v-col>
        <v-col cols="12" md="6" class="mt-6 pt-16 pa-md-16 leading-relaxed">
          <p>
            Realtime price tickers for a variety of assets are included from the
            <a
              href="https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams"
              target="_blank"
              >Websocket API</a
            >. One stream provides all live data, each event from the stream is
            filtered by its identifier and mutates state within the vuex store.
            The ticker components listen via getters for the data. The initial
            connection to the stream is made via the created lifecycle hook in
            the <a href="https://vuejs.org/" target="_blank">Vue</a> app.
          </p>
          <p class="mt-6">
            <a href="https://vuetifyjs.com/en/" target="_blank">Vuetify</a> has
            an excellent data-table component used to present and manipulate the
            information. In addition the border is coloured dynamically based on
            whether the asset has increased or decreased in price in the
            previous 24 hours.
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      id="top-shortcut"
      dark
      fab
      button
      small
      fixed
      :color="topButtonColor"
      class="elevation-8"
      @click="$vuetify.goTo(0, options)"
      @mouseenter="topButtonColor = 'white'"
      @mouseleave="topButtonColor = 'accent'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </svg>
    </v-btn>
  </div>
</template>

<script>
import Ticker from '../components/Ticker'

export default {
  name: 'About',
  title: 'Bitcoin Perspective | About',
  components: {
    'data-ticker': Ticker,
  },
  data() {
    return {
      binanceLogo: require('../assets/binanceLogo.svg'),
      options: {
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic',
      },
      topButtonColor: 'accent',
    }
  },
}
</script>

<style>
#binance-logo {
  width: 90%;
}
#top-shortcut {
  bottom: 1rem;
  right: 1rem;
  transition: all 200ms ease-out;
}

/* UTILITY CLASSES */
.h-screen {
  height: 100vh;
}
.h-full {
  height: 100%;
}
.min-h-screen {
  min-height: 100vh;
}
.relative {
  position: relative;
}

.tracking-wider {
  letter-spacing: 0.05em;
}
.tracking-widest {
  letter-spacing: 0.1em;
}

.leading-tight {
  line-height: 1.25;
}
.leading-relaxed {
  line-height: 1.625;
}
.leading-loose {
  line-height: 2;
}
</style>
