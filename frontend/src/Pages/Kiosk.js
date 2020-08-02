import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';

export class Kiosk extends Component {
    state = {
        rating: 1
      };

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
      }

    render() {
        const { rating } = this.state;
        return (
            <div>
            <h2>Rating from state: {rating}</h2>
            <StarRatingComponent 
              name="rate1" 
              starCount={5}
              value={rating}
              onStarClick={this.onStarClick.bind(this)}
            />
          </div>
        )
    }
}

export default Kiosk
