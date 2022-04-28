import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-select-skipper',
  templateUrl: './skipper.component.html',
  styleUrls: ['./skipper.component.scss'],
})
export class SelectSkipperComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const params = this.route.snapshot.paramMap;
    const rentalId = parseInt(params.get('rentalId') ?? '');
    this.router.navigate(['/verhuur/betalen', rentalId]);
  }
}
