import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';
import Like from './common/like';
import ListGroup from './common/listGroup';
import Pagination from './common/pagination';
import { getGenres } from '../services/fakeGenreService';
import { paginate } from '../utils/paginate';

class Movies extends Component {
    state = { 
        movies: [],
        genres: [],
        currentPgae: 1, 
        pageSize: 4
     }; 
     componentDidMount (){
        const genres = [{ name: 'All Genres'},...getGenres()];
            this.setState({ movies: getMovies(), genres });
     }

     handleDelete = movie => {
          const movies = this.state.movies.filter(m => m._id !== movie._id);
          this.setState({ movies });    
        };
     handleLike = movie => {
            const movies = [...this.state.movies];
            const index = movies.indexOf(movie);
            movies[index] = {...movies[index] };
            movies[index].liked = !movies[index].liked; 
            this.setState({ movies }); 

        };
    handlePageChange = page => {
               this.setState({ currentPgae : page });
    };
    handleGenreSelect = genre => {
          this.setState({ selectedGenre: genre, currentPgae: 1});
    };        
    render() { 
          const { length: count} = this.state.movies;

          const { pageSize, currentPgae, selectedGenre, movies: allMovies } = this.state;
        if(count ===0) return <p> There are no movies in the database!</p>;
        const filtered = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies;
        const movies = paginate(filtered, currentPgae, pageSize);
        return (
        <div className="row">
                  <div className="col-2">
                    <ListGroup 
                    items={this.state.genres}
                    selectedItem= {this.state.selectedGenre}
                    onItemSelect={this.handleGenreSelect} />
                  </div>
                  <div className="col">
                  <p>Showing {filtered.length} movies in the database</p>
           <table className="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Stock</th>
                    <th>Rate</th>
                    <th />
                    <th />
                </tr>
            </thead>
            <tbody>
                {movies.map(movie => 
                (<tr key={movie._id}>
                    <td>{movie.title}</td>
                    <td>{movie.genre.name}</td>
                    <td>{movie.numberInStock}</td>
                    <td>{movie.dailyRentalRate}</td>
                    <td><Like liked={movie.liked} onClick= {() => this.handleLike(movie)}/></td>
                    <td>
                        <button onClick={() => this.handleDelete(movie) } className="btn btn-danger btn-sm">Delete</button>
                    </td>
                </tr>
                ))}
                
            </tbody>
        </table> 
        <Pagination 
               itemsCount={filtered.length} 
               pageSize={pageSize} 
               currentPgae={currentPgae}
               onPageChange={this.handlePageChange}
         />
                  </div>
                 
        </div>
        );
    
    }
}
 
export default Movies;