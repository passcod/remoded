window.Remoded = (manifest, loc) ->
  scopes = [{
    # Element zero is the root scope
    matches: []
    domains: []
    ports: []
    loads: []
    children: []
    }]

  
  loc = parseUri loc
  current_scope = 0

  match  = (expr) -> scopes[current_scope].matches.push expr
  domain = (expr) -> scopes[current_scope].domains.push expr 
  port   = (expr) -> scopes[current_scope].ports.push expr

  load = (files...) ->
    files = files[0] if Array.isArray files[0]
    files =  [files] if typeof files is 'string' or typeof files is 'number'
    scopes[current_scope].loads.push files...

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

  return processScopes(scopes, loc)

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


# Process the scopes object generated from the manifest
# against the location provided and return instructions
# for remoded.
processScopes = (scopes, loc) ->
  instructions =
    load:  []

  for scope in scopes
    pass = true
    pass &&= loc.port in scope.ports if scope.ports.length > 0
    pass &&= !(false in (for domain in scope.domains
      if typeof domain is 'string'
        domain = domain.replace /(^\s+|\s+$)/g, ''
        loc.hostname is domain
      else if domain instanceof RegExp
        domain.test loc.hostname
      else
        # If we don't recognize it, ignore it
        true
    ))
    pass &&= !(false in (for match in scope.matches
      if typeof match is 'string'
        match = match.replace /(^\/?|\/?$)/g, ''
        match is loc.pathname.replace(/(^\/?|\/?$)/g, '') + loc.search + loc.hash
      else if match instanceof RegExp
        match.test loc.requestUri + loc.hash
      else
        # If we don't recognize it, ignore it
        true
    ))

    if pass
      instructions.load.push scope.loads...

  if instructions.load.length > 0
    instructions
  else
    false