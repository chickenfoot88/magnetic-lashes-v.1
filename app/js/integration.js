
		$(document).ready(function() {
			validate();
			(function() {
				Leadrock.init({
					formSelectors: {
						formsClassName: &apos;lead_form&apos;,
						name: &apos;.name&apos;,
						phone: &apos;.phone&apos;,
						email: &apos;.email&apos;,
						price: &apos;.price&apos;,
						other: &apos;.other-simple-data&apos;
					},
					goal: &apos;Lead&apos;,
					urlConfig: {
						thankYouPage: &apos;confirm.html&apos;
					}
				});
			})(Leadrock);

			window.onload = function(e) {
				var forms = document.getElementsByClassName(&apos;form&apos;);
				for (i = 0; i < forms.length; i++) {
					var form = forms[i];
					form.addEventListener(&apos;submit&apos;, function(e) {
						if (this.querySelector(&apos;.phone&apos;).value == &apos;&apos;) {
							e.stopImmediatePropagation();
							e.preventDefault();
						}
					});
				}
			}
		});

		Leadrock.init({
      
			formSelectors: {
				formsClassName: &apos;lead_form&apos;,
				name: &apos;.name&apos;,
				phone: &apos;.phone&apos;,
				email: &apos;.email&apos;,
				price: &apos;.price&apos;,
				other: &apos;.other-simple-data&apos;
			},
			thankYouCallback: function(leadId) {
      	var filia_url = "<a href="http://l3004.offerteonline2017.com/affiliateproject/tracker/click/?pub_id=1fd7b875d347&land_id=1948"">http://l3004.offerteonline2017.com/affiliateproject/tracker/click/?pub_id=1fd7b875d347&land_id=1948"</a>;

				var xhr = new XMLHttpRequest();

			  xhr.open(&apos;POST&apos;, &apos;<a href="http://leadrock.com/api/integration/getClickId?domain=">http://leadrock.com/api/integration/getClickId?domain=</a>&apos; + Leadrock.getLandingDomain(), true);

				xhr.withCredentials = true; xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

				xhr.onload = function() {
					var click_id = JSON.parse(xhr.responseText).click_id;
					var iframe = document.createElement(&apos;iframe&apos;);
					iframe.src = filia_url + &apos;&subid2=&apos; + click_id;
					iframe.style.display = &apos;none&apos;;
					document.body.appendChild(iframe);
					Leadrock.redirectToThankYouPage(leadId);
				};

				xhr.send(); return false; }, goal: &apos;Lead&apos;, urlConfig: { thankYouPage: &apos;confirm.html&apos; }
      });
