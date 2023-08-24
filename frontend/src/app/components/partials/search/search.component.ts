import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchTerm: string = '';

  constructor(activatedRoute: ActivatedRoute, private router: Router) {
    activatedRoute.params.subscribe(params => {
      if (params.searchTerm) this.searchTerm = params.searchTerm;
    })
  }

  ngOnInit(): void {
  }

  search(term: string): void {
    console.log('term:', term)
    if (term) {
      this.router.navigateByUrl('/search/' + term);
    }
  }


}
