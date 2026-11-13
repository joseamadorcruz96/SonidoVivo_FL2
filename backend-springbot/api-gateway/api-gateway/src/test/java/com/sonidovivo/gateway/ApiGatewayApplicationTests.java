package com.sonidovivo.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiGatewayApplicationTests {

	@LocalServerPort
	private int port;

	@Test
	void contextLoads() {
	}

	@Test
	void preflightCorsPermiteOrigenFrontend() {
		RestClient client = RestClient.create("http://localhost:" + port);
		var response = client.options()
				.uri("/api/v1/productos")
				.header(HttpHeaders.ORIGIN, "http://localhost:5173")
				.header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET")
				.header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Authorization, Content-Type")
				.retrieve()
				.toBodilessEntity();

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("http://localhost:5173", response.getHeaders().getAccessControlAllowOrigin());
	}
}
