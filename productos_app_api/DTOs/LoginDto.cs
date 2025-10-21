using System;

namespace productos_app_api.DTOs;

public class LoginDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }

}
