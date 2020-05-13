import { mount, shallowMount } from '@vue/test-utils'
import ListHistogram from '@/components/ListHistogram.vue'

import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('ListHistogram.vue', () => {
  const movies = [
    { rating: 1 },
    { rating: 2 },
    { rating: 3 },
    { rating: 2 }
  ];

  it('shows counts of movies by rating', () => {
    const wrapper = mount(ListHistogram, {
      propsData: {
        movies: movies
      },
      created() {
        this.$vuetify.lang = {
          t: () => {},
        }
      }
    });
    const expectedText = [
      '0 scored 0  (0.0%)',
      '1 scored 1  (25.0%)',
      '2 scored 2  (50.0%)',
      '1 scored 3  (25.0%)'
    ].join('');
    expect(wrapper.text()).toEqual(expectedText);
  })

  it("renders histogram block widths in proportion to the weight of the rating", () => {
    const wrapper = shallowMount(ListHistogram, {
      propsData: {
        movies: movies
      }
    });
    const expectedWidths = ['0%', '25%', '50%', '25%']
    const actualWidths = wrapper
      .findAll('#histogram div').wrappers
      .map(div => div.attributes().style.match(/width: ([^\;]+)/)[1]);
    expect(actualWidths).toEqual(expectedWidths);
  });

  it("doesn't render anything if the list is empty", () => {
    const wrapper = shallowMount(ListHistogram, {
      propsData: {
        movies: []
      }
    });
    expect(wrapper.isEmpty()).toBe(true);
  });
})
