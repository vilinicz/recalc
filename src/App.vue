<template>
  <div id="app">
    <div class="header">
      Экспресс оценка стоимости объекта*
    </div>

    <div class="calculator">
      <div class="district">
        <label for="district">Выберите округ:</label>
        <select
          id="district"
          v-model="selected"
          class="input"
        >
          <option
            v-for="(d, i) in districts"
            :key="i"
            :value="d"
          >
            {{ d.abbr }}
          </option>
        </select>
      </div>

      <div
        ref="map"
        class="map"
      >
        <svg
          viewBox="0 0 286 327"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g class="districts">
            <g
              v-for="(d, i) in districts"
              :key="`path-${i}`"
              :class="{'selected': d === selected}"
              class="d"
              @click="selected = d"
            >

              <path
                :d="d.shape"
                vector-effect="non-scaling-stroke"
              />
              <!--text
                :class="`label-${d.properties.id}`"
                :x="geoPath().projection(projection()).centroid(d)[0]"
                :y="geoPath().projection(projection()).centroid(d)[1]"
                alignment-baseline="central"
                class="label"
                fill="black"
                text-anchor="middle"
              >{{ d.properties.abbr }}
              </text-->
            </g>
          </g>
        </svg>
      </div>

      <div class="area">
        <label for="area">
          Площадь обьекта:
        </label>
        <div class="wrapper">
          <vue-numeric
            id="area"
            v-model="area"
            class="input"
            currency=""
            separator="space"
            :min="areaMin"
            :max="areaMax"
          />
          <span>м2</span>
        </div>
        <vue-slider
          v-model="area"
          :contained="true"
          :height="3"
          :max="areaMax"
          :min="areaMin"
          tooltip="none"
          :interval="100"
          dot-size="16"
        />
      </div>
      <a
        v-smooth-scroll
        href="#result"
        class="btn"
        @click="calculate()"
      >Рассчитать</a>
    </div>

    <div
      id="result"
      class="result"
    >
      <transition name="fade">
        <div
          v-if="calculated"
          class="calculated"
        >
          <div>
            <div class="label">
              Текущая стоимость объекта:
            </div>
            <div
              class="value"
              v-html="costToString(currentCost)"
            />
          </div>
          <div>
            <div class="label">
              Стоимость ретауна:
            </div>
            <div
              class="value"
              v-html="costToString(rebuildCost)"
            />
          </div>
          <div class="total">
            <div class="label">
              Стоимость объекта после реновации:
            </div>
            <div
              class="value"
              v-html="costToString(newCost)"
            />
          </div>

          <div class="disclaimer">
            *Дисклеймер про оферту и все такое вот разное,
            например две строчки, ну или там
          </div>

          <a
            href="#contacts"
            class="btn"
          >Обсудить</a>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import VueNumeric from 'vue-numeric';
import districts from '@/assets/districts.json';

export default {
  name: 'App',
  components: {
    VueSlider,
    VueNumeric,
  },

  data() {
    return {
      districts,
      area: 10000,
      areaMin: 1000,
      areaMax: 50000,

      selected: districts[0],

      calculated: false,

      currentCost: 0,
      rebuildCost: 0,
      newCost: 0,
    };
  },

  methods: {
    calculate() {
      this.calculated = false;
      this.currentCost = Math.round(this.area * this.selected.old_meter_cost);
      this.rebuildCost = Math.round(this.area * this.selected.development_meter_cost);
      this.newCost = Math.round(this.area * this.selected.new_meter_cost);

      setTimeout(() => {
        this.calculated = true;
      }, 800);
    },

    costToString(n) {
      if (n > 1000000000) {
        return `${Math.round((n / 1000000000) * 10) / 10} <span>млрд. руб</span>`;
      }
      if (n > 1000000) {
        return `${Math.round((n / 1000000) * 10) / 10} <span>млн. руб</span>`;
      }
      return `${Math.round((n / 1000) * 10) / 10} <span>тыс. руб</span>`;
    },
  },
};
</script>

<style lang="scss">
  $light: #F2F7FA;
  $gray: #dcdcdc;
  $black: #181818;
  $red: #F8244B;

  $primary: $red;

  $bgColor: rgba(#c3c3c3, 0.7);
  $themeColor: $primary;
  @import '~vue-slider-component/lib/theme/default';


  #app {
    color: $black;
    min-height: 100%;
    background: $light linear-gradient(20.06deg, #D8D8D8 -54.86%, #F2F7FA 53.79%, #FFFFFF 101.94%);
    position: relative;
    padding: 2rem 1rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows:
      auto
      minmax(calc(100vh - 4rem - 80px - 60px), auto)
      minmax(calc(100vh - 2rem - 60px), auto);
    grid-template-areas: 'header' 'calculator' 'result';

    @media(min-width: 1024px) {
      padding: 5vh 6vw;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 6vw;
      grid-template-rows: auto 1fr;
      grid-template-areas:
        'header header'
        'calculator result';
    }
    @media (min-width: 1200px) {
      padding: 8vh 10vw;
      grid-column-gap: 10vw;
    }

    .btn {
      width: 100%;
      height: 52px;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background-color: $black;
      color: #fff;
      margin-top: 1.25rem;
      font-size: 16px;
      transition: opacity 0.25s ease;
      &:hover {
        opacity: 0.8;
      }
      @media(min-width: 768px) {
        margin-top: 2.5rem;
      }
    }


    .header {
      grid-area: header;
      font-weight: 900;
      font-size: 28px;
      color: $black;
      line-height: 1.1;
      padding-bottom: 1rem;
      border-bottom: 2px solid $gray;
      @media(min-width: 768px) {
        font-size: 34px;
      }
      @media(min-width: 1200px) {
        font-size: 38px;
      }
    }


    .calculator {
      grid-area: calculator;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      overflow: hidden;
      padding-top: 1.25rem;

      .map {
        margin: auto;
        overflow: hidden;
        max-width: 33vh;
        width: 100%;

        @media(min-width: 1024px) {
          max-width: 40vh;
        }

        svg {
          height: 100%;
          width: 100%;
        }

        .d {
          fill: $gray;
          transition: fill 0.25s ease;
          cursor: pointer;
          stroke: $light;
          stroke-width: 2px;

          &:hover {
            fill: darken($gray, 5%);

            .label {
              fill: $black;
            }
          }

          &.selected {
            fill: $primary;

            .label {
              fill: $light;
            }
          }

          &:hover, &.selected {
            .label {
              // opacity: 1;
            }
          }
        }

        .label {
          opacity: 0;
          transition: opacity 0.20s ease;
          font-size: 12px;
          font-weight: bold;
          z-index: 1;
          stroke-width: 0;
          font-variant: small-caps;
        }
      }

      .district, .area {
        z-index: 2;
        label {
          display: block;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: $black;
        }

        .input {
          -webkit-appearance: none;
          background-color: transparent;
          font-size: 18px;
          font-weight: 800;
          line-height: 1;
        }

        @media(min-width: 768px) {
          label {
            font-size: 1.2rem;
          }
          .input {
            font-size: 24px;
          }
        }
      }

      .district {
        align-self: flex-start;
        select {
          background: transparent url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>") no-repeat;
          background-position-x: 100%;
          background-position-y: 50%;
          padding-right: 20px;
        }
      }

      .area {
        text-align: right;
        margin-top: auto;
        .wrapper {
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
        }
        .input {
          text-align: right;
        }
        span {
          margin-left: 0.5rem;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.2;
          @media(min-width: 768px) {
            font-size: 24px;
          }
        }
      }

      .area .vue-slider {
        margin-top: 0.75rem;
        .vue-slider-rail{
          position: relative;
          &:before, &:after {
            content: '';
            position: absolute;
            top: 0;
            left: -6px;
            width: 6px;
            height: 3px;
            background-color: $red;
          }
          &:after {
            right: -6px;
            left: auto;
            background-color: $bgColor;
          }
        }
        .vue-slider-dot-handle {
          border-radius: 0;
          box-shadow: none;
          background-color: $red;
        }
      }

      .btn {
        background-color: $black;
      }

      @media(min-width: 768px) {
        padding-top: 2.5rem;
      }
    }

    .result {
      grid-area: result;
      padding-top: 3rem;
      .calculated {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
      }
      .label {
        margin-bottom: 1rem;
      }
      .value {
        font-size: 24px;
        font-weight: 800;
        padding-bottom: 0.25rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid rgba($gray, 0.5);
        span {
          font-size: 0.8em;
        }
      }
      .total {
        margin: auto 0;
        .value {
          border-bottom: 0;
          font-size: 42px;
          font-weight: 900;
        }
      }

      .disclaimer {
        margin-top: auto;
        font-style: italic;
        // To align with area slider
        padding-bottom: 3px;
        line-height: 16px;

        font-size: 13px;
      }
      .btn {
        background-color: $red;
      }

      @media(min-width: 768px) {
        padding-top: 2.5rem;
        .label {
          font-size: 1.2rem;
        }
        .value {
          font-size: 32px;
        }
        .total > .value {
          font-size: 48px;
        }

        .disclaimer {
          font-size: 1rem;
        }
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s ease-in-out;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>
