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
        <div class="wrapper">
          <label for="area">
            Площадь обьекта:
          </label>
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
          :height="4"
          :max="areaMax"
          :min="areaMin"
          tooltip="none"
          :interval="100"
          dot-size="20"
        />
      </div>
      <!--a
        v-smooth-scroll
        href="#result"
        class="btn"
        @click="calculate()"
      >Рассчитать</a-->
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
            *Результаты оценки указываются приблизительные,
            без учета индивидуальных факторов, влияющих на реальную стоимость.
            Для точной информации обратитесь к нашим специалистам:
          </div>

          <a
            href="#contacts"
            class="btn"
          >Оставить заявку</a>
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

      calculated: true,

      // currentCost: 0,
      // rebuildCost: 0,
      // newCost: 0,
    };
  },

  computed: {
    currentCost() {
      return Math.round(this.area * this.selected.old_meter_cost);
    },

    rebuildCost() {
      return Math.round(this.area * this.selected.development_meter_cost);
    },

    newCost() {
      return Math.round(this.area * this.selected.new_meter_cost);
    },
  },

  methods: {
    calculate() {
      this.calculated = false;
      // this.currentCost = Math.round(this.area * this.selected.old_meter_cost);
      // this.rebuildCost = Math.round(this.area * this.selected.development_meter_cost);
      // this.newCost = Math.round(this.area * this.selected.new_meter_cost);

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
  $blue: #394874;
  $blue-map: #476597;
  $gray-map: #AFBBCE;

  $bgColor: #104670; //rgba(#c3c3c3, 0.7);
  $themeColor: $primary;
  @import '~vue-slider-component/lib/theme/default';


  #app {
    color: $blue;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    background: linear-gradient(228.61deg, #FFFFFF 2.65%, #D8D8D8 124.94%);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows:
      auto
      minmax(calc(100vh - 4rem - 80px - 60px), auto)
      minmax(calc(100vh - 2rem - 60px), auto);
    grid-template-areas: 'header' 'calculator' 'result';

    @media(min-width: 1024px) {
      margin: auto;
      width: 900px;
      height: 674px;
      padding: 50px 25px;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 25px;
      grid-template-rows: auto 1fr;
      grid-template-areas:
        'header header'
        'calculator result';
    }

    .btn {
      width: 100%;
      height: 60px;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: linear-gradient(355.43deg, #A61E34 -188.54%, #F8244B 158.01%);
      box-shadow: -9px 7px 14px #C7C7C7;
      color: #fff;
      margin-top: 1.25rem;
      font-size: 16px;
      font-weight: 500;
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
      line-height: 1.1;
      padding: 0 25px;
      padding-bottom: 1rem;
      // border-bottom: 2px solid $gray;
      @media(min-width: 768px) {
        font-size: 34px;
      }
      @media(min-width: 1024px) {
        font-size: 42px;
      }
    }


    .calculator {
      grid-area: calculator;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      overflow: hidden;
      padding: 1.25rem 25px 0;

      .map {
        // margin: auto;
        padding: 10px;
        padding-left: 15px;
        margin: -10px;
        margin-top: -60px;
        overflow: hidden;
        //height: 270px;
        width: 270px;
        // width: 100%;

        svg {
          height: 100%;
          width: 100%;
          filter:
            drop-shadow(-5px 3px 0px #566093)
            drop-shadow(-2px 4px 3px rgba(69, 89, 114, 0.4));
        }

        .d {
          fill: $blue-map;
          transition: fill 0.25s ease;
          cursor: pointer;
          stroke: $light;
          stroke-width: 1px;

          &:hover {
            fill: $gray-map;

            .label {
              fill: $black;
            }
          }

          &.selected {
            fill: $gray-map;

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
        }

        .input {
          -webkit-appearance: none;
          background-color: transparent;
          font-size: 18px;
          font-weight: 800;
          line-height: 1;
          color: $blue;
        }

        @media(min-width: 768px) {
          label {
            font-size: 1.2rem;
          }
          .input {
            font-size: 24px;
          }
        }

        @media(min-width: 1024px) {
          label {
            font-size: 15px;
          }
          .input {
            font-size: 34px;
          }
        }
      }

      .district {
        align-self: flex-end;
        text-align: right;
        select {
          background: transparent url(assets/polygon.svg) no-repeat;
          background-position-x: 100%;
          background-position-y: 50%;
          padding-right: 30px;
          text-align: right;
          text-align-last:right;
          position: relative;
        }
      }


    .area {
        margin-top: auto;
        margin-bottom: 48px;
        .wrapper {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1rem;
          label {
            margin-bottom: 0;
            line-height: 34px;
            flex-shrink: 0;
          }
          input {
            line-height: 34px;
          }
        }
        .input {
          text-align: right;
          width: 50%;
        }
        span {
          margin-left: 0.5rem;
          // font-size: 18px;
          font-weight: 800;
          line-height: 1.2;
          @media(min-width: 1024px) {
            font-size: 34px;
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
            left: -9px;
            width: 11px;
            height: 4px;
            background-color: $red;
          }
          &:after {
            right: -9px;
            left: auto;
            background-color: $bgColor;
          }
        }
        .vue-slider-dot {
          //width: 23px !important;
          //height: 30px !important;
          // background-image: url(assets/rectangle.svg);
          // background-repeat: no-repeat;
          // background-size: contain;
          // box-shadow:  -7px 6px 12px rgba(35, 40, 53, 0.2556);

        }
        .vue-slider-dot-handle {
          border-radius: 0;
          background: linear-gradient(46.38deg, #A61E34 -134.57%, #F8244B 52.56%);
          box-shadow: -7px 6px 12px rgba(35, 40, 53, 0.2556);
          z-index: 999;
          //background-image: url(assets/rectangle.svg);
          //background-repeat: no-repeat;
          //background-size: contain;
          //background-color: transparent;
          //display: none;
          // background: linear-gradient(46.38deg, #A61E34 -134.57%, #F8244B 52.56%);
          //background-image: url(assets/rectangle.svg);
          // background-position: 100% 50%;
          //width: 23px;
          //height: 30px;

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
      padding: 0 25px;
      padding-top: 3rem;
      .calculated {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
      }
      .label {
        margin-bottom: 0.2rem;
      }
      .value {
        font-size: 24px;
        font-weight: 800;
        padding-bottom: 0.25rem;
        margin-bottom: 35px;
        // border-bottom: 2px solid rgba($gray, 0.5);
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

      @media(min-width: 1024px) {
        padding-top: 2.5rem;
        .label {
          font-size: 1rem;
        }
        .value {
          font-size: 36px;
        }
        .total > .value {
          font-size: 52px;
          margin-bottom: 20px;
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
