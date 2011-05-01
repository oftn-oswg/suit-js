<?php

/**
 * Dependency calculator written by Devin Samarin
 **/

class UI {

	private $list = array();
	private $location = false;

	public function __construct($directory) {
		$this->location = $directory;
		
		$obj = json_decode(file_get_contents(
			dirname($_SERVER['SCRIPT_FILENAME'])."/".$this->location."/__dependencies__.json")
		, true);

		$L = array();
		$S = array(); // elements with no dependencies
		$T = array(); // elements with dependencies

		foreach( $obj as $k => $v ) {
			if( $v == false ) {
				$S[] = $k; // no dependencies
			} else {
				$T[] = $k; // has dependencies
			}
		}

		while( !empty($S) ) {                                     // while S is non-empty:
			$n = array_pop($S);                                   //     n = pop element from S
			$L[] = $n;                                            //     append n to L
			foreach( $T as $mi => $m ) {                          //     for each element m in T:
				if(($i = array_search($n, $obj[$m])) !== false) { //         if m depends on n:
					unset($obj[$m][$i]);                          //             remove dependency on n from m
				}
				if( empty($obj[$m]) ) {                           //             if m has no dependencies left:
					unset($T[$mi]);                               //                 remove m from T
					$S[] = $m;                                    //                 append m to S
				}
			}
		};

		if( !empty($T) ) {
			throw new DependenciesUnresolvedException($obj);
		}
		
		$this->list = $L;
	}

	public function output_scripts() {

		foreach( $this->list as $file ) {
			echo '<script src="'.$this->location.'/'.$file.'.js" type="application/ecmascript"></script>' . "\n";
		}
	
	}

	public function output_scripts_inline() {

		echo '<script type="application/ecmascript">'."\n";
		foreach( $this->list as $file ) {
			readfile(dirname($_SERVER['SCRIPT_FILENAME'])."/".$this->location.'/'.$file.'.js');
			echo "\n";
		}
		echo '</script>' . "\n";
	}

}

class DependenciesUnresolvedException extends Exception {

	public $obj = array();
	public $errors = array();

	public function __construct($obj) {
		parent::__construct();
		$this->obj = $obj;
	}

	public function scan_errors() {
	
		$unknown = array();
		$itemwodep = false;
		foreach( $this->obj as $file => $deps ) {
			if( $deps ) {
				foreach( $deps as $d ) {
					if( !isset($this->obj[$d]) ) {
						$unknown[] = array(
							'item' => $d,
							'found' => $file
						);
					}
				}
			} else {
				$itemwodep = true;
			}
		}
		if( !$itemwodep ) $this->errors[] = "There must be an item that has no dependencies.";
		foreach( $unknown as $u ) {
			$this->errors[] = "Item '".$u['found']."' depends on unknown dependency '".$u['item']."'.";
		}
		
		return $this->errors;
	}
}
