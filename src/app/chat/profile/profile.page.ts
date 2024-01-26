import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Component for displaying a user's profile.
 * Retrieves the user's ID from the route parameters and fetches the user's data.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  /**
   * The user object containing the user's information. Initially set to undefined until the data is retrieved.
   * @type {any}
   */
  user: any;
  link: string = "/chat/chatroom/";

  /**
   * Constructs the ProfilePage component and injects necessary dependencies.
   * 
   * @param {ActivatedRoute} route - The activated route that holds the information about the route associated with this component, including the route parameters.
   */
  constructor(private route: ActivatedRoute) { }

  /**
   * On component initialization, subscribes to route parameters to retrieve and handle the user ID.
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.user = params['id'];
      this.link += this.user;
    });
  }
}
