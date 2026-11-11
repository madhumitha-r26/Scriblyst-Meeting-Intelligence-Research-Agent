"""Provider connector placeholder.

Implement Calendar/Meet/Zoom/Teams using each provider's official API and OAuth.
Bifrost only handles model requests; it does not automatically connect meetings.
"""
def list_meetings(provider, access_token, time_min, time_max):
    raise NotImplementedError("Configure the provider's official API and OAuth flow.")
