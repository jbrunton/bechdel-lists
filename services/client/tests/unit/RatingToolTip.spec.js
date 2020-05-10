import { shallowMount } from '@vue/test-utils'
import RatingToolTip from '@/components/RatingToolTip.vue'

import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('RatingToolTip.vue', () => {
  it('highlights the given rating', () => {
    [
      { rating: 0, description: 'Fewer than two named women' },
      { rating: 1, description: 'Has at least two named women in it' },
      { rating: 2, description: 'Who talk to each other' },
      { rating: 3, description: 'About something besides a man' }
    ].forEach(ratingInfo => {
      const wrapper = shallowMount(RatingToolTip, {
        propsData: {
          rating: ratingInfo.rating
        }
      })
      const selected = wrapper.find('.selected');
      expect(selected.exists()).toBe(true);
      expect(wrapper.find('.selected').text()).toMatch(ratingInfo.description);
    });
  })
})
