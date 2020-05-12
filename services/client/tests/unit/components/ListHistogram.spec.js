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
    const expectedCounts = ['scored 0  (0.0%)', 'scored 1  (25.0%)', 'scored 2  (50.0%)', 'scored 3  (25.0%)'];
    expectedCounts.forEach(expectedCount => {
      expect(wrapper.text()).toEqual(expect.stringContaining(expectedCount));
    });
  })

  it("renders histogram block widths in proportion to the weight of the rating", () => {
    const wrapper = shallowMount(ListHistogram, {
      propsData: {
        movies: movies
      }
    });
    const expectedWidths = ['0%', '25%', '50%', '25%']
    expectedWidths.forEach((expectedWidth, index) => {
      const style = wrapper
        .find('#histogram')
        .findAll('#histogram div')
        .at(index).attributes().style;
      expect(style).toEqual(expect.stringContaining(`width: ${expectedWidth}`));
    });
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
