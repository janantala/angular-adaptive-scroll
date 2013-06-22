describe('adaptive.scroll', function() {

  var rootscope;

  beforeEach(module('adaptive.scroll'));

  beforeEach(inject(function($rootScope) {
    rootScope = $rootScope;
    spyOn(rootScope, "$on").andCallThrough();
    spyOn(rootScope, "$broadcast").andCallThrough();
  }));

  describe('$gyroscope service', function() {

    var $gyroscope;

    beforeEach(inject(function (_$gyroscope_) {
      $gyroscope = _$gyroscope_;
    }));

    it('should be an object', function () {
      expect(typeof $gyroscope).toBe('object');
    });

    it('should have methods watchPosition(), ignorePosition()', function () {
      expect($gyroscope.watchPosition).toBeDefined();
      expect($gyroscope.ignorePosition).toBeDefined();

      expect(typeof $gyroscope.watchPosition).toBe('function');
      expect(typeof $gyroscope.ignorePosition).toBe('function');
    });

  });


  describe('adaptivescroll directive', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
      elm = angular.element(
        '<textarea adaptivescroll>' +
        '</textarea>'
      );

      scope = $rootScope;

      $compile(elm)(scope);
      scope.$digest();
    }));

    it('should have called rootScope.$on', function(){
      expect(rootScope.$on).toHaveBeenCalled();
    });


  });


});