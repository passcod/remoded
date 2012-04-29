window.Remoded = (manifest, loc) ->
  scopes = [{
    # Element zero is the root scope
    matches: []
    domains: []
    ports: []
    loads: []
    children: []
    }]

  
  loc = log parseUri loc
  current_scope = 0

  match  = (expr) -> scopes[current_scope].matches.push expr
  domain = (expr) -> scopes[current_scope].domains.push expr 
  port   = (expr) -> scopes[current_scope].ports.push expr

  load = (files) ->
    files = [files] if typeof files is 'string' or typeof files is 'number'
    for file in files
      scopes[current_scope].loads.push file

  scope = (call) ->
    # Elevate the scope before executing the contents...
    length = scopes.push
      contents: call
      matches: []
      domains: []
      ports: []
      loads: []
      children: []
      parent: current_scope

    scopes[current_scope].children.push length - 1
    current_scope = length - 1

    call()

    # ...and lower it afterwards
    current_scope = scopes[current_scope].parent


  eval manifest

  return log scopes

RegExp.prototype.toJSON = -> this.toString()
Function.prototype.toJSON = -> this.toString()

# See https://gist.github.com/2482831
parseUri = (uri) ->
  result = {}
  a = document.createElement 'a'
  props = 'protocol hostname host pathname port search hash href'.split ' '
  
  a.href = uri
  
  # Copy relevant properties
  result[prop] = a[prop] for prop in props
  
  # For window.location compatibility
  result.toString = -> a.href
  result.requestUri = a.pathname + a.search

  # Not standard
  result.protocol = a.protocol.replace ':', ''

  # Default ports by protocol
  protocols =
    http: 80
    https: 443
    ftp: 21
  if protocols[result.protocol] and not a.port
    result.port = +protocols[result.protocol]
  
  result