/* Mass API docs sandbox and schema browser. */
(function () {
  'use strict';

  var state = {
    specs: [],
    operationsByTag: {},
    schemas: []
  };

  function $(id) {
    return document.getElementById(id);
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function loadJson(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) throw new Error('Failed to load ' + path);
      return response.json();
    });
  }

  function clearSelect(select, placeholder) {
    select.innerHTML = '';
    var option = document.createElement('option');
    option.value = '';
    option.textContent = placeholder;
    select.appendChild(option);
  }

  function operationLabel(op) {
    var summary = op.summary ? ' - ' + op.summary : '';
    return op.method + ' ' + op.path + summary;
  }

  function bodyTemplate(op) {
    if (!op || !op.requestBody) return '';
    if (op.path === '/v1/programs/submit') {
      return JSON.stringify({
        massProgram: {
          program_id: 'prog_docs_demo',
          program_type: 'operation_yaml',
          operation_type: 'entity.incorporate',
          entity_id: 'ent_01HZQ3',
          params: {
            jurisdiction: 'us-de',
            entity_type: 'llc',
            name: 'Meridian Dynamics LLC'
          }
        }
      }, null, 2);
    }
    if (op.path === '/v1/biscuits/mint') {
      return JSON.stringify({
        subject: 'did:mass:agent:demo',
        ttl_seconds: 3600,
        caveats: [
          {
            type: 'operation',
            families: ['entity.incorporate']
          }
        ]
      }, null, 2);
    }
    return JSON.stringify({
      schema: op.requestBody.schema || op.requestBody.schemaType || 'request-body',
      note: 'Populate fields required by the selected OpenAPI operation.'
    }, null, 2);
  }

  function simulatedResponse(op, bodyText) {
    var parsedBody = null;
    var parseError = null;
    if (bodyText && bodyText.trim()) {
      try {
        parsedBody = JSON.parse(bodyText);
      } catch (error) {
        parseError = error.message;
      }
    }
    if (parseError) {
      return {
        status: 400,
        body: {
          error: 'invalid_json',
          message: parseError
        }
      };
    }
    var okStatus = '200';
    for (var i = 0; i < (op.responses || []).length; i++) {
      if (/^2/.test(op.responses[i])) {
        okStatus = op.responses[i];
        break;
      }
    }
    var body = {
      simulated: true,
      operationId: op.operationId || null,
      method: op.method,
      path: op.path,
      status: 'accepted',
      request_digest: 'sha256:docs-sandbox-simulation',
      source: 'data/openapi-index.json'
    };
    if (op.path === '/v1/programs/submit') {
      body.schema = 'mass-proof.v1';
      body.verdict_ref = 'verdict:docs-demo';
      body.admissible = false;
      body.non_admissible_reasons = ['simulation_only'];
    }
    if (parsedBody) body.received = parsedBody;
    return {
      status: Number(okStatus) || 200,
      body: body
    };
  }

  function selectedOperation() {
    var resource = $('sb-primitive');
    var action = $('sb-action');
    if (!resource || !action || !resource.value || !action.value) return null;
    var ops = state.operationsByTag[resource.value] || [];
    return ops[Number(action.value)] || null;
  }

  function renderOperation() {
    var method = $('sb-method');
    var path = $('sb-path');
    var body = $('sb-body');
    var output = $('sb-output');
    var op = selectedOperation();
    if (!op) {
      if (method) method.textContent = '';
      if (path) path.textContent = '';
      if (body) body.value = '';
      return;
    }
    if (method) method.textContent = op.method;
    if (path) path.textContent = op.path;
    if (body) body.value = bodyTemplate(op);
    if (output) {
      output.querySelector('code').innerHTML = '<span class="code-dim">Ready to simulate ' + esc(op.operationId || op.path) + '.</span>';
    }
  }

  function initSandbox() {
    var resource = $('sb-primitive');
    var action = $('sb-action');
    var send = $('sb-send');
    var body = $('sb-body');
    var output = $('sb-output');
    var timing = $('sb-timing');
    if (!resource || !action || !send || !body || !output) return;

    loadJson('data/openapi-index.json')
      .then(function (specs) {
        state.specs = specs;
        clearSelect(resource, 'Select resource');
        specs.forEach(function (spec) {
          state.operationsByTag[spec.tag || spec.title] = spec.operations || [];
          var option = document.createElement('option');
          option.value = spec.tag || spec.title;
          option.textContent = (spec.tag || spec.title) + ' (' + (spec.operation_count || 0) + ')';
          resource.appendChild(option);
        });
      })
      .catch(function (error) {
        output.querySelector('code').innerHTML = '<span class="code-dim">' + esc(error.message) + '</span>';
      });

    resource.addEventListener('change', function () {
      clearSelect(action, '--');
      var ops = state.operationsByTag[resource.value] || [];
      ops.forEach(function (op, index) {
        var option = document.createElement('option');
        option.value = String(index);
        option.textContent = operationLabel(op);
        action.appendChild(option);
      });
      renderOperation();
    });

    action.addEventListener('change', renderOperation);

    send.addEventListener('click', function () {
      var op = selectedOperation();
      if (!op) return;
      var start = performance.now();
      var result = simulatedResponse(op, body.value);
      var elapsed = Math.max(1, Math.round(performance.now() - start));
      if (timing) timing.textContent = elapsed + 'ms';
      output.querySelector('code').textContent =
        'HTTP/1.1 ' + result.status + '\\n' + JSON.stringify(result.body, null, 2);
    });
  }

  function renderSchema(schema) {
    var meta = $('schema-meta');
    var title = $('schema-title-bar');
    var output = $('schema-output');
    if (!meta || !title || !output) return;
    if (!schema) {
      meta.innerHTML = '';
      title.textContent = 'schema';
      output.innerHTML = '<span class="code-dim">Select a schema above.</span>';
      return;
    }
    title.textContent = schema.file || schema.title || 'schema';
    meta.innerHTML = [
      '<span>type: ' + esc(schema.type || 'unknown') + '</span>',
      '<span>required: ' + esc((schema.required || []).length) + '</span>',
      '<span>properties: ' + esc((schema.properties || []).length) + '</span>',
      '<span>' + esc(schema.id || '') + '</span>'
    ].join('');
    output.textContent = JSON.stringify({
      title: schema.title,
      type: schema.type,
      required: schema.required || [],
      properties: (schema.properties || []).slice(0, 40)
    }, null, 2);
  }

  function initSchemas() {
    var select = $('schema-select');
    if (!select) return;
    loadJson('data/schemas.json')
      .then(function (schemas) {
        state.schemas = schemas;
        clearSelect(select, 'Select a schema');
        schemas.forEach(function (schema, index) {
          var option = document.createElement('option');
          option.value = String(index);
          option.textContent = (schema.title || schema.file) + ' (' + (schema.type || 'unknown') + ')';
          select.appendChild(option);
        });
      })
      .catch(function (error) {
        var output = $('schema-output');
        if (output) output.textContent = error.message;
      });

    select.addEventListener('change', function () {
      renderSchema(state.schemas[Number(select.value)] || null);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSandbox();
    initSchemas();
  });
}());
